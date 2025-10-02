import React, { useState } from 'react';

function App() {
  const [cart, setCart] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const categories = ['رجال', 'نساء', 'أطفال'];

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { from: 'user', text: input }]);
      setInput('');
      setTimeout(() => {
        setMessages((prev) => [...prev, { from: 'bot', text: 'شكرا لتواصلك معنا 💬' }]);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-3xl font-bold text-center text-orange-700 mb-6">🛍️ متجر الملابس</h1>
      
      <div className="grid grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat} className="bg-white shadow-lg rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-2">{cat}</h2>
            <button
              onClick={() => addToCart(cat)}
              className="bg-orange-600 text-white px-4 py-2 rounded-xl"
            >
              أضف للعربة
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold">🛒 العربة</h2>
        <ul className="list-disc pl-6">
          {cart.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold">💬 الشات</h2>
        <div className="border rounded-lg p-3 h-40 overflow-y-auto bg-white">
          {messages.map((msg, i) => (
            <div key={i} className={msg.from === 'user' ? 'text-right' : 'text-left'}>
              <span className={msg.from === 'user' ? 'text-orange-700' : 'text-gray-600'}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow border rounded-l-lg p-2"
          />
          <button
            onClick={sendMessage}
            className="bg-orange-600 text-white px-4 rounded-r-lg"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
