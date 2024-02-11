import React, { useContext, useEffect, useState, useRef } from 'react'
import { UserContext } from './userContext'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
// import { uniqBy } from 'lodash'




const Chat = () => {



    const [ws, setWs] = useState(null)
    const [onlinePeople, setOnlinePeople] = useState({})
    const [selectedUser, setSelectedUser] = useState("")
    const [newMessage, setNewMessage] = useState("")
    const currentUser = useContext(UserContext)
    const [messages, setMessages] = useState([])

    const divref = useRef()

    useEffect(() => {
        if (divref.current) {
            divref.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",

            })
        }
    }, [messages])



    useEffect(() => {
        Reconnect()
        // console.log(ws)
    }, [messages])



    const Reconnect = () => {
        const WS = new WebSocket('ws://localhost:4400')

        WS.addEventListener('message', handleMessage)
        setWs(WS);

        WS.addEventListener('close', () => {
            setTimeout(() => {
                console.log("Trying to reconnect")
                Reconnect();
            }, 1000)
        })
    }


    // useEffect((selectedUser)=>{
    //     axios.get('/api/messages')

    // },[selectedUser])

    const showOnlinePeople = (peopleArray) => {

        const people = {}

        if (peopleArray) {
            peopleArray.forEach(({ userId, username }) => {
                people[userId] = username;// to put only unique elements


            })
        }


        setOnlinePeople(people)

        // console.log((onlinePeople), "hell")


    }
    const sendMessage = (e) => {
        e.preventDefault();
        if (newMessage.length === 0) {
            setNewMessage("")
            return;
        }
        ws.send(JSON.stringify({

            receiver: selectedUser,
            text: newMessage,


        }))


        setMessages([...messages, {
            text: newMessage,
            sender: true,
            senderId: currentUser.loginInfo.id,
            receiverId: selectedUser,
        }]);









        console.log(messages, "here")
        setNewMessage("")

    }




    const handleMessage = (e) => {


        const messageData = e.data
        const parsedMessageData = JSON.parse(messageData)

        // console.log(JSON.parse(messageData), "messageData")
        //   JSON.parse(messageData)



        //ev.data has online object with user deatils

        if ('online' in parsedMessageData) {
            showOnlinePeople(parsedMessageData.online)
        }
        else if ('text' in parsedMessageData) {
            console.log(parsedMessageData, "parse")

            // const mssgUnique = uniqBy([...messages,  parsedMessageData ], 'id')
            setMessages([...messages, parsedMessageData])

            // console.log(mssgUnique);
            console.log(messages, "hello");



        }
    }

    const avatarAPI = "https://api.dicebear.com/6.x/avataaars/svg"


    // console.log(mssgUnique)

    const styles = {
        box: "bg-blue-100 h-screen w-full flex overflow-none",
        left: "bg-slate-100 w-1/3 max-w-sm ",
        right: " w-2/3 flex flex-col flex-grow relative ",
        input: " rounded-lg p-3 w-full focus:outline-none caret-green-600  ",
        messages: "flex flex-grow  justify-center items-end  ",
        input_wrap: "   flex flex-row justify-center items-center pb-4 sticky gap-4 px-2 ",
        icon: "bg-green-500 text-xl p-4 text-black  rounded-xl  ",
        sender: "bg-green-300 text-black text-left rounded-lg",
        receiver: "bg-blue-50 text-gray-700 text-left rounded-lg",

    }



    // useEffect(() => {



    // }, [messages])


    // const mssgUnique = uniqBy(messages, 'id')


    const [showEmojis, setShowEmojis] = useState(false)

    const addEmoji = (e) => {
        let sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);
        setNewMessage(newMessage + emoji);
    }




    return (
        <div className={styles.box}>
            <div className={styles.left}>
                <div className=" flex bg-gray-100 mb-10 shadow-sm p-4  pl-8 rounded-md align-middle gap-2">
                    <img src="./vite.svg" />
                    <span className='text-2xl  font-bold  text-gray-700'>Samvaad</span>
                </div>
                <br />
                <br />
                <p className='text-2xl  font-semibold font-mono border-gray-200     text-gray-500 pl-4 pt-4 pb-2 mb-2'>Friends </p>
                <div className='shadow-sm rounded-lg  '>
                    {
                        Object.keys(onlinePeople).map(userId => {
                            if (onlinePeople[userId] === currentUser.loginInfo.username) return "";
                            return (
                                <div
                                    className={" flex flex-row  item-center p-2  text-xl  cursor-pointer rounded-md  gap-2 mb-1  shadow-sm duration-500  mx-auto hover:{pb-4 scale-150} hover:bg-blue-100" + (userId === selectedUser ? " bg-blue-100   border-blue-500  " : ' bg-green-100')}
                                    key={userId}
                                    onClick={() => setSelectedUser(userId)}
                                >

                                    <div className={userId === selectedUser ? " w-1 bg-lime-500 my-(-4) mr-8  " : ""}></div>
                                    <img src={avatarAPI + `?seed=${userId}`} className='h-10' />

                                    <span className='pt-2'>{onlinePeople[userId]}</span>


                                </div>)
                        })
                    }
                </div>
            </div>
            <div className={` ${styles.right}`}>
                {(!selectedUser) && (
                    <div className='flex  flex-grow justify-center items-center h-100'>
                        <div className={`{$styles.messages} text-2xl text-slate-400 `}>
                            &larr; Select a friend to see chat
                        </div>
                    </div>
                )
                }

                {selectedUser &&
                    (
                        <div className={` ${styles.messages} relative h-full   `}>
                            <div className='  w-full overflow-y-scroll  absolute top-0 bottom-2 left-0 right-0  '>


                                {
                                    messages.length > 0 ?
                                        messages.map((message, index) =>
                                            <div className={`flex w-100 p-2 + ${message.senderId === currentUser.loginInfo.id ? 'justify-end' : 'justify-start'}`} key={index}>


                                                <div className={`p-2 inline-block w-max-6 +  ${message.senderId === currentUser.loginInfo.id ? styles.sender : styles.receiver}`} >
                                                    {message.text}</div>

                                            </div>
                                        )


                                        : null
                                }
                                <div ref={divref} />
                            </div>
                        </div>
                    )

                }


                {selectedUser &&
                    (
                        <div className=''>
                            <div>
                                {showEmojis && (
                                    <div>
                                        <Picker data={data} onEmojiSelect={addEmoji} />
                                    </div>
                                )}
                            </div>
                            <form className={styles.input_wrap} onSubmit={sendMessage}>

                                <div className=' bg-white flex flex-row items-center justify-start rounded-full px-3 flex-1'>
                                    <button
                                        className='w-fit '
                                        onClick={() => setShowEmojis((prev) => !prev)}
                                    ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                                        </svg>
                                    </button>

                                    <input

                                        placeholder='Enter Your Message here'
                                        value={newMessage}
                                        className={styles.input}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                </div>
                                <button className={styles.icon} type='submit'
                                >
                                    <span >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                        </svg>

                                    </span>
                                </button>


                            </form>
                        </div>
                    )


                }
            </div>
        </div>
    )
}

export default Chat