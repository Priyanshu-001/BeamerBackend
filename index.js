const express = require('express')
const app = express()
const server = app.listen(process.env.PORT || 8080,()=>console.log('hi'))
const cors = require('cors')
app.use(cors({
	origin:'*',
}))
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

