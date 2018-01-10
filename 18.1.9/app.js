var express = require('express')
var body = require('body-parser')
var multer = require('multer')
var fs = require('fs')
var path = require('path')
var mysql = require('mysql')
var app = express()
var pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'yuanfang',
    database: 'cococ',
    port: '3306'
})
// SQL.pool({
//  host:'127.0.0.1',
//  user:'root',
//  password:'wcgloveyou521',
//  database:'cococ',
//  port:'3306'
// })
app.use(body.urlencoded({}))
app.use(multer({
    dest: './images'
}).any())

app.post('/images', function(req, res) {
    var file = req.files[0]
    var oldname = file.filename
    var h = path.parse(file.originalname).ext
    var newname = file.filename + h
    fs.rename('./images/' + oldname, './images/' + newname, function(err) {
        if (err) {
            console.log(err)
            return
        }
        res.send('/images/' + newname)
    })
})


// SQL.sql({
//  sql:'select * from login where uid=?',
//  arr:[1],
//  data:function(da){
//      console.log(da)
//  }
// })


app.post('/loginup', function(req, res) {
    var user = req.body.user
    var pass = req.body.pass
    var img = req.body.img
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err)
            return
        }
        var sql = 'select user from login where user=?'
        connection.query(sql, [user], function(err, data) {
            if (err) {
                console.log(err)
                return
            }
            if (data == '') {
                var sql1 = 'insert into login(user,pass,img) values(?,?,?)'
                connection.query(sql1, [user, pass, img], function(err, data1) {
                    if (err) {
                        console.log(err)
                        return
                    }
                    res.send('ok')
                    connection.end()
                })
            } else {
                res.send('no ok')
            }

        })
    })
})

//登录

app.post('/loginin', function(req, res) {
    var user = req.body.user
    var pass = req.body.pass
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err)
            return
        }
        var sql = 'select * from login where user=?'
        connection.query(sql, [user], function(err, data) {
            if (err) {
                console.log(err)
                return
            }
            console.log(data)
            if (data == '') {
                res.send('用户名不存在')
            } else {
                if (data[0].pass == pass) {
                    res.send(data[0].img)
                } else {
                    res.send('密码错误')
                }
            }
            connection.end()
        })
    })

})

app.post('/add', function(req, res, next) {
    var title = req.body.a;
    var content = req.body.b;
    var zuo = req.body.c;
    console.log(title, content)
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err)
            return
        }
        var sql = 'INSERT INTO list (name,bookname,text) VALUES (?,?,?)'
        connection.query(sql, [title, content, zuo], function(err, data) {
            if (err) {
                console.log(err)
                return
            }
            res.send('ok')
            connection.end()
        })
    })
});

app.post('/shuju', function(req, res, next) {
    // res.header('Access-Control-Allow-Origin', '*')
    // connection.query('SELECT * FROM text', function(err, rows, fields) {
    //     res.send(rows)
    // })
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err)
            return
        }
        var sql = 'SELECT * FROM list'
        connection.query(sql, function(err, data) {
            if (err) {
                console.log(err)
                return
            }
            res.send(data)
            connection.end()
        })
    })
});

app.get('/delete', function(req, res) {
    var uid = req.query.uid
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err)
            return
        }
        var sql = 'delete from list where uid = ?'
        connection.query(sql, [uid], function(err, data) {
            if (err) {
                console.log(err)
                return
            }
            res.send('ok')
            connection.end()
        })
    })
})

app.get('/update', function(req, res) {
    var uid = req.query.uid
    var user = req.query.user
    var pass = req.query.pass
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err)
            return
        }
        var sql = 'update list set user=?,password=? where uid=?'
        connection.query(sql, [user, pass, uid], function(err, data) {
            if (err) {
                console.log('mysql::::::' + err)
                return
            }
            res.send('ok')
            connection.end()
        })
    })
})


app.use(express.static('./'))
app.listen(8000, function() {
    console.log('ok')
})