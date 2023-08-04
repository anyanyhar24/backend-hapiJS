const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const InvariantError = require('../../error/InvariantError')
const NotFoundError = require('../../error/NotFoundError')
const Users = require('../../model/users')
const Authentications = require('../../model/authentications')
const autoBind = require('auto-bind')
const { mappingUsers } = require('../../utils')
const AuthorizationError = require('../../error/AuthorizationError')

class UsersService {
  constructor () {
    this._user = Users
    this._authentications = Authentications

    autoBind(this)
  }

  async addUser ({ fullname, username, password, confirmPassword, email, phoneNumber, address, role = 'user' }) {
    await this.verifyDuplicateData(fullname, username, email, phoneNumber)

    const id = `user-${nanoid(16)}`

    if (password !== confirmPassword) {
      throw new InvariantError('Password dan Confirm Password Tidak Cocok')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const schema = {
      id,
      fullname,
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      address,
      role
    }

    const result = await this._user(schema)

    if (!result) {
      throw new InvariantError('Gagal registrasi user')
    }

    await result.save()

    return result.fullname
  }

  async getAllUsers () {
    const result = await this._user.find()

    if (!result) {
      throw new NotFoundError('User Belum ada yang mendaftar')
    }

    return result.map(mappingUsers)
  }

  async getAllUserspaginate (page, limit) {
    const totalUsers = await this._user.countDocuments()
    const totalPages = Math.ceil(totalUsers / limit)
    const users = await this._user.find().skip((page - 1) * limit).limit(limit)

    if (!users) {
      throw new NotFoundError('User Belum ada yang mendaftar')
    }

    return {
      totalUsers,
      page,
      totalPages,
      users: users.map(mappingUsers)
    }
  }

  async getUserById (id) {
    const result = await this._user.findOne({ id })

    if (!result) {
      throw new NotFoundError('Gagal Mendapatkan data user, id tidak ditemukan!')
    }

    return mappingUsers(result)
  }

  async editUserById (id, { fullname, username, password, confirmPassword, email, phoneNumber, address }) {
    await this.verifyDuplicateData(fullname, username, email, phoneNumber, id)

    const updatedAt = new Date().toISOString()

    if (password !== confirmPassword) {
      throw new InvariantError('Password dan Confirm Password tidak cocok!')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await this._user.findOneAndUpdate(
      { id },
      {
        fullname,
        username,
        password: hashedPassword,
        email,
        phoneNumber,
        address,
        updatedAt
      },
      { new: true }
    )

    if (!result) {
      throw new NotFoundError('Gagal memperbarui data user, id tidak ditemukan')
    }

    return result.fullname
  }

  async deleteUserById (id) {
    const user = await this._user.findOne({ id })

    if (!user) {
      throw new NotFoundError('Gagal menghapus user, id tidak ditemukan!')
    }

    const auth = await this._authentications.findOne({ idUser: id })

    if (auth) {
      await this._authentications.deleteOne({ idUser: id })
    }

    const result = await this._user.findOneAndDelete({ id })

    return result.fullname
  }

  async verifyCredentials ({ email, password }) {
    const user = await this._user.findOne({ email })

    if (!user) {
      throw new NotFoundError('Email yang anda masukkan salah!')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      throw new InvariantError('Password yang anda masukkan salah!')
    }

    return user.id
  }

  async verifyDuplicateData (fullname, username, email, phoneNumber, id = null) {
    const sameFullname = await this._user.findOne({ fullname })
    const sameUsername = await this._user.findOne({ username })
    const sameEmail = await this._user.findOne({ email })
    const samephoneNumber = await this._user.findOne({ phoneNumber })

    if (sameFullname && sameFullname.id !== id) {
      throw new InvariantError('Nama pengguna telah terdaftar!')
    }

    if (sameUsername && sameUsername.id !== id) {
      throw new InvariantError('Username telah terdaftar!')
    }

    if (sameEmail && sameEmail.id !== id) {
      throw new InvariantError('Email telah terdaftar, mohon ganti email anda!')
    }

    if (samephoneNumber && samephoneNumber.id !== id) {
      throw new InvariantError('Nomor Handphone telah terdaftar, mohon ganti nomor Handphone anda!')
    }
  }

  async verifyAdminRole (id) {
    const user = await this._user.findOne({ id })

    if (user.role !== 'admin') {
      throw new AuthorizationError('Anda tidak memiliki akses pada service ini!')
    }
  }
}

module.exports = UsersService
