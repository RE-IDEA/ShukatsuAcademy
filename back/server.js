const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const app = express();
const port = 5000;


const KEYFILE_NAME = `keyfile.json`;
const KEYFILE_PATH = `./${KEYFILE_NAME}`;

const append = async (first_name, family_name, email, company_name, message) => {
    console.log(`--Google SpreadSheet認証を行います!`);
    let sheets = {};
    
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: KEYFILE_PATH,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        sheets = google.sheets({version: 'v4', auth});
    } catch (error) {
        console.log(error);
    }
    
    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: `1BrxvVxJbYZIw-SKoMzK_5buRIvcyB8_zfCZZQLr_c5w`, //シートのIDを指定
            range: `海外LP!A:H`, //書き込む範囲を指定
            valueInputOption: 'RAW',
            requestBody: {
                values: [
                    [first_name, family_name, company_name, email, message] // 書き込むデータを指定
                ]
            }
        });
    } catch (error) {
        console.log(error);
    }
}

// トランスポーターを作成
const transporter = nodemailer.createTransport({
    service: 'Gmail', // 使用するサービス（Gmailなど
    secure: true, // trueでSSL / TLSを使用します
    auth: {
        user: 'reidea.official@gmail.com', // 送信元メールアドレス
        pass: 'vcwm yzkj zxaw vlxk' // 送信元メールアドレスのパスワード
    }
});


// CORSミドルウェアを適用
app.use(cors());
// body-parserミドルウェアを使用してリクエストボディをパースする
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// POSTリクエストを受け取るエンドポイント
app.post('/', (req, res) => {
    const email = req.body.email;
    const first_name = req.body.first_name;
    const family_name = req.body.family_name;
    const company_name = req.body.company_name;
    const message = req.body.message;
    // 送信するメールのオプションを設定
    const mailOptions = {
        from: 'reidea.official@gmail.com', // 送信元メールアドレス
        to: email, // 送信先メールアドレス
        subject: '【RE-IDEA】サイト公開前事前登録にご登録いただきありがとうございます。',
        text: first_name + family_name +'様\n\n\n'
            + '初めまして、RE-IDEA代表の中井と申します。\n\n'
            + 'この度は、IDEA実現プラットフォーム「RE-IDEA」のサイト前事前登録にご登録いただき、誠にありがとうございます。\n事前登録いただいた方には、サイト公開時のご報告などRE-IDEAの最新情報をお届けさせていただきます。（営業メールなどはございません。）\n\n'
            + '以下では、RE-IDEAのサイト公開時に記載するIDEAやIDEAの募集題目をご登録いただけます。\n'
            + 'いち早くご登録いただいた方にはサイト公開時や公開前に、IDEAマンや企業様とマッチできる可能性が高まりますので、是非この機会をご活用ください！\n\n'
            + '【IDEAマン向け】\nIDEA事前投稿フォーム：https://forms.gle/u8JyaSmscTn2XXZb8\n\n'
            + '【企業様向け】\nIDEA事前募集フォーム：https://forms.gle/TcFrnvQvpRbZBtvo6\n\n\n'
            + '----------------------\nRE-IDEA\n代表　中井涼祐\n\n〒151-0051 東京都渋谷区千駄ヶ谷 1-30-10-4F\nTEL : 070-1436-0803 \n個人Mail：ryosuke.nakai@re-ldea.com\nお問い合わせ : info@re-ldea.com'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.status(500).send('Failed to send email');
        } else {
            append(first_name, family_name, email, company_name, message )
                .then(() => {
                    console.log('Email sent: ' + info.response);
                    res.status(200).send('Data written to spreadsheet successfully!');
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).send('Failed to write data to spreadsheet');
                });
        }
    });
});

// サーバーを起動
app.listen(port, () => {
    console.log(`Server!! is running on http://localhost:${port}`);
});