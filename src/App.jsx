import { useEffect, useRef, useState } from "react";

function* _generateMessage () {
    while (true) {
        yield { name: 'Monika', message: "Hey there!! =P How are you?))" };
        yield { name: 'Monika', message: "Oh hi!!! I'm great 8) Where have you gone yesterday?))" };
        yield { name: 'Monika', message: "I've got some extra plans. sorry =(" };
        yield { name: 'Monika', message: "I have nothing else to say so good bye" };
    }
}
const __generateMessage = _generateMessage();
const generateMessage = () => __generateMessage.next().value;

function formatTimestamp (date) {
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const hours = date.getHours();

    return `${hours}:${minutes}`;
}

function MessageEditor (props) {
    const [message, setMessage] = useState('');

    function inputHandler (e) {
        setMessage(e.target.value);
    }

    function send () {
        props.send('Me', message);
        setMessage('');
    }

    return (
        <div className="fixed bottom-0 inset-x-0 flex flex-row bg-slate-800 py-2 px-4 gap-4">
            <input type="text" placeholder="Type your message here..." value={message} onInput={inputHandler}
                onKeyUp={(e) => { e.key === 'Enter' ? send() : null }}
                className="grow bg-slate-700 text-slate-100 p-2 rounded-lg focus:outline-none" />
            <button onClick={send}>Send</button>
        </div>
    );
}

function Message(props) {
    const element = useRef();
    const incoming = props.data.name !== 'Me';

    useEffect(() => {
        element.current.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <li ref={element} className={`message flex flex-row mx-2 my-1 mt-5 ${incoming ? 'justify-start' : 'justify-end'}`}>
            <div className={`${incoming ? 'origin-bottom-left' : 'origin-bottom-right'}`}>
                <header className="flex flex-row justify-end mb-1 gap-1 text-sm">
                    <div className="name font-semibold">{props.data.name}</div>
                    <div className="timestamp font-light">{formatTimestamp(props.data.timestamp)}</div>
                </header>

                <div className={`relative text-lg py-2 px-4 rounded-2xl text-slate-900 bg-opacity-70 backdrop-blur-sm ${incoming ? 'bg-green-500' : 'bg-white'}`}>
                    {props.data.message}
                    <div className={`absolute top-full h-3 w-5 bubble-tail bg-opacity-70 backdrop-blur-sm ${incoming ? 'left-6 bg-green-500' : 'right-6 bg-white'}`}></div>
                </div>
            </div>
        </li>
    )
}

function App() {
    const [messages, setMessages] = useState([]);
    
    function newMessage (name, message) {
        if (!message)
            return;

        setMessages(o => [
            ...o,
            { name, message, timestamp: new Date() }
        ]);

        setTimeout(() => {
            const m = generateMessage();

            setMessages(o => [
                ...o,
                { name: m.name, message: m.message, timestamp: new Date() }
            ]);
        }, (Math.random() + 0.5) * 5000);
    }

    return (
        <section className="h-full overflow-hidden">
            <div className="overflow-auto min-h-full pb-24">
                <ul>{messages.map((e, i) =>
                    <Message key={i} data={e} /> 
                )}</ul>
            </div>

            <MessageEditor send={newMessage} />
        </section>
    )
}

export default App
