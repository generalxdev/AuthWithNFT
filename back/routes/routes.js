const os = require('os')
const express = require('express')
const Model = require('../models/model')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: os.tmpdir() })

const Jimp = require('jimp')
const fs = require('fs')
const qrCode = require('qrcode-reader')

const checkQRCode = async (nftIDs, file) => {
    const buffer = fs.readFileSync(file.path)

    try {
        const image = await Jimp.read(buffer);
        const qrcode = new qrCode();

        const ind = await new Promise((resolve, reject) => {
            qrcode.callback = function (err, value) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    const name = value.result.split('/').pop();
                    const extracted = name.substring(0, name.indexOf('.'));
                    resolve(extracted);
                }
            };
            qrcode.decode(image.bitmap);
        });

        fs.unlinkSync(file.path)

        if (nftIDs.indexOf(ind) != -1) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

router.post('/login', upload.single('qrcode'), async (req, res) => {
    const { username, password, wallet } = req.body
    Model.findOne({ username: username }).then(async (user) => {
        if (user) {
            if (password !== user.password) {
                res.send({ message: 'Incorrect Password' })
                return
            }
            if (wallet !== user.wallet) {
                res.send({ message: 'Login with your Wallet' })
                return
            }
            const val = await checkQRCode(user.nfts, req.file)
            if (val == true) {
                res.send({ message: 'Success' })
            } else {
                res.send({ message: 'Incorrect QR Code' })
            }
        } else {
            res.send({ message: 'Unregistered User' })
        }
    })
})

router.post('/register', async (req, res) => {
    const { username, password, nfts, wallet } = req.body
    Model.findOne({ username: username }).then((user) => {
        if (user) {
            res.send({ message: 'user already exists' })
        } else {
            const tmp = new Model({ username, password, nfts, wallet })
            tmp.save()
            res.send({ message: 'success' })
        }
    })
})

module.exports = router