import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../../api/aiApi';

const ChatIA = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll al final cuando hay nuevos mensajes
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleToggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await sendMessage(inputMessage);

            const botMessage = {
                text: response.response,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = {
                text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Botón flotante */}
            <button
                className={`w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center ${isOpen ? 'opacity-0 pointer-events-none scale-0' : ''}`}
                onClick={handleToggleChat}
                aria-label="Abrir chat"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-7 h-7 text-white"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                    />
                </svg>
            </button>

            {/* Ventana de chat */}
            <div className={`absolute bottom-0 right-0 w-96 h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-95 pointer-events-none'}`}>
                {/* Header */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-5 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-base">Asistente IA</h3>
                            <p className="text-xs opacity-90">Siempre listo para ayudarte</p>
                        </div>
                    </div>
                    <button
                        className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center"
                        onClick={handleToggleChat}
                        aria-label="Minimizar chat"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 bg-gray-50 flex flex-col gap-3">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-10 px-5">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mb-5 animate-pulse">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-10 h-10 text-white"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                                    />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">¡Hola! 👋</h4>
                            <p className="text-sm text-gray-600">Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} transition-opacity duration-300`}
                            >
                                <div className={`max-w-[75%] px-4 py-3 rounded-xl ${msg.sender === 'user'
                                    ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-br-sm'
                                    : msg.isError
                                        ? 'bg-red-100 text-red-700 rounded-bl-sm'
                                        : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
                                    }`}>
                                    <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                                    <span className={`block text-[10px] mt-1 ${msg.sender === 'user' ? 'opacity-70' : 'opacity-50'}`}>
                                        {msg.timestamp}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white px-4 py-3 rounded-xl shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_1.4s_infinite]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_1.4s_infinite_0.2s]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_1.4s_infinite_0.4s]"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form className="p-4 bg-white border-t border-gray-200 flex gap-2" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="Escribe tu mensaje..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        disabled={!inputMessage.trim() || isLoading}
                        aria-label="Enviar mensaje"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5 text-white"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                            />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatIA;
