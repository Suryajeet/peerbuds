// var Socketiop2p = require('../../../index')
// var io = require('socket.io-client')

function loadScript(url, callback){
  // Adding the script tag to the head as suggested before
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;

  // Then bind the event to the callback function.
  // There are several events for cross browser compatibility.
  script.onreadystatechange = callback;
  script.onload = callback;

  // Fire the loading
  head.appendChild(script);
}
loadScript('node_modules/socket.io-client',init);

function init (io) {
  var socket = io()
  var opts = {peerOpts: {trickle: false}, autoUpgrade: false}
  var p2psocket = new Socketiop2p(socket, opts, function () {
    privateButton.disabled = false
    p2psocket.emit('peer-obj', 'Hello there. I am ' + p2psocket.peerId)
  })

  // Elements
  var form = document.getElementById('msg-form')
  var box = document.getElementById('msg-box')
  var msgList = document.getElementById('msg-list')
  
  p2psocket.on('peer-msg', function (data) {
    var li = document.createElement('li')
    li.appendChild(document.createTextNode(data.textVal))
    msgList.appendChild(li)
  })

  form.addEventListener('submit', function (e, d) {
    e.preventDefault()
    var li = document.createElement('li')
    li.appendChild(document.createTextNode(box.value))
    msgList.appendChild(li)
    if (boxFile.value !== '') {
      var reader = new window.FileReader()
      reader.onload = function (evnt) {
        p2psocket.emit('peer-file', {file: evnt.target.result})
      }
      reader.onerror = function (err) {
        console.error('Error while reading file', err)
      }
      reader.readAsArrayBuffer(boxFile.files[0])
    } else {
      p2psocket.emit('peer-msg', {textVal: box.value})
    }
    box.value = ''
    boxFile.value = ''
  })

}

document.addEventListener('DOMContentLoaded', init, false)