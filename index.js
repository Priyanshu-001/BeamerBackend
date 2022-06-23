const express = require('express')
const multer  = require('multer')
const app = express()
const  path = require('path')
const server = app.listen(process.env.PORT || 8080,()=>console.log('hi'))
const cors = require('cors')

app.use(cors({
	origin:'*',
}))
app.use('/files', express.static(process.cwd() + '/uploads'));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd()+'/uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

    cb(null,'file-'+uniqueSuffix+path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

const io = require('socket.io')(server,{
  cors: {
    origin: '*',
  }
})

io.sockets.on('connection',(socket)=>{
	socket.on('join',id=>{
		console.log(id)
		socket.join(id)
	})
	socket.on('file',file=>{
		console.log(JSON.parse(file))
		 for (x of socket.rooms) {
       		io.to(x).emit('file', file);
     	}
	})
	socket.on('msg',msg=>{
		console.log("msg=",msg)
		console.log('to=',socket.rooms)
		 for (x of socket.rooms) {
       		io.to(x).emit('msg', msg);
       		console.log('sent to',x)

    	}
	})
}
)
app.post('/upload',upload.single('file'),(req,res)=>{
	return res.json({'name': req.file.originalname, url:req.file.filename ,'type': req.file.mimetype, 'size': req.file.size})

})
app.all('*',(req,res)=>{
	return res.redirect()
})
