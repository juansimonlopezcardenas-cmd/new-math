let historialChat = [
    {
        role: "system",
        content: "Eres un tutor de matemáticas amigable y socrático. Guía al estudiante paso a paso con preguntas y pistas, pero NUNCA le des la respuesta final directamente.Y trata de NO desviarte del tema de las matematicas por nada del mundo"
    },
    {
        role: "user",
        content: "Hola, quiero resolver una ecuación."
    },
    {
        role: "assistant",
        content: "¡Hola! Entendido. Escribe una ecuación (por ejemplo, 2x + 4 = 10) y la resolveremos juntos paso a paso."
    }
];

// Tu clave de Groq actual
const API_KEY = "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"; 

async function enviarMensaje() {
    const inputField = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    const textoUsuario = inputField.value.trim();

    if (!textoUsuario) return;

    chatBox.innerHTML += `<div class="mensaje usuario">${textoUsuario}</div>`;
    inputField.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    historialChat.push({
        role: "user",
        content: textoUsuario
    });

    const idCargando = "cargando_" + Date.now();
    chatBox.innerHTML += `<div id="${idCargando}" class="mensaje tutor" style="color: #666;">El tutor está pensando...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    const url = "https://api.groq.com/openai/v1/chat/completions";

    try {
        const respuesta = await fetch(url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b", // Modelo actualizado y activo en Groq
                messages: historialChat,
                temperature: 0.7
            })
        });

        const data = await respuesta.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        const textoTutor = data.choices[0].message.content;

        document.getElementById(idCargando).remove();

        chatBox.innerHTML += `<div class="mensaje tutor">${textoTutor.replace(/\n/g, '<br>')}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;

        historialChat.push({
            role: "assistant",
            content: textoTutor
        });

    } catch (error) {
        console.error("Error:", error);
        document.getElementById(idCargando).remove();
        chatBox.innerHTML += `<div class="mensaje tutor" style="color: red;">Error: ${error.message}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function manejarEnter(event) {
    if (event.key === "Enter") {
        enviarMensaje();
    }
}