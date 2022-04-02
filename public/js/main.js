const answers = []
const questions = [
    {
        pregunta: "¿Tienes fiebre?",
        respuesta: "Tengo fiebre"
    },
    {
        pregunta: "¿Tienes dolor de cabeza?",
        respuesta: "Tengo dolor de cabeza"
    },
    {
        pregunta: "¿Te duele el estómago?",
        respuesta: "Me duele el estómago"
    },
    {
        pregunta: "¿Padezco dolor de garganta?",
        respuesta: "Me duele la garganta"
    },
    {
        pregunta: "¿Presentas dolor en la espalda?",
        respuesta: "Me duele la espalda"
    },
    {
        pregunta: "¿Tienes dolor en alguna extremidad?",
        respuesta: "Me duele una extremidad"
    },
    {
        pregunta: "¿Presentas dolor ocular?",
        respuesta: "Me duele la vista"
    },
    {
        pregunta: "¿Presentas Diarrea?",
        respuesta: "Tengo diarrea"
    },
    {
        pregunta: "¿Tienes manchas en la piel?",
        respuesta: "Tengo machas en la piel"
    }
]

const urgencies = [
    "Diarrea",
    "Dolor de cabeza",
    "Dolor de espalda",
    "Fiebre",
    "Dolor de vista",
    "Manchas en la piel"
]

const bot = [
    "Oh, no! Los síntomas que tienes debe ser tratados con urgencia, es decir, te recomiendo que veas un doctor para que te brinde mayor información",
    "Tus síntomas no son graves; no obstante, como consejo: podrías acercarte a un doctor con la finalidad de recibir una receta.",
    "No te desesperes, ni te asustes. Los sintomas que pacedes son curables, y para ello te recomendamos visitar a un doctor."
]

const Essalud = {
    name: "Essalud",
    number: "(01)411-8000",
    sede: "Av. Arenales N° 1402 Jesús María, Lima 11 - Perú",
}

const Sisol = {
    name: "Sisol",
    number: "988 589 299",
    sede: "Calle Carlos Concha 163 - San Isidro",
}

const option1 = $('#option1')
const option2 = $('#option2')

const buttons = [option1, option2]

// Form - Input del chat
$('#options').submit(function(event){
    event.preventDefault()
})

let i = 0
for(i; i < buttons.length; i++) {
    buttons[i].text(questions[i].pregunta)
    buttons[i].val(questions[i].respuesta)
}
console.log(i)

let tieneSintomas = false

buttons.forEach(option => {
    option.click(function() {
        if (!tieneSintomas) {
            document.getElementById('noSintomas').classList.remove('noshow')
            tieneSintomas = true
        }

        for (let j = 1; j < 3; j++) {
            // div chat
            const chat = document.createElement('div')

            if (j % 2 == 0) chat.classList.add("chat", "chat--left")
            else chat.classList.add("chat", "chat--right")

            // div avatar - imagen avatar
            const avatar = document.createElement('div')
            avatar.classList.add("chat-avatar")
            const avatarImg = document.createElement('img')

            if (j % 2 == 0) avatarImg.setAttribute('src', '/images/robot 1 (1).svg')
            else avatarImg.setAttribute('src', '/images/user.jpg')

            avatar.appendChild(avatarImg)

            // div message - messageValue
            const messageContainer = document.createElement('div')
            messageContainer.classList.add("chat-message")
            const message = document.createElement('p')

            let messageValue
            if (j % 2 == 0) { 
                messageValue = "¿Algún otro síntoma?"
                message.innerText = messageValue
            }
            else {
                messageValue = option.val()
                if (answers.length != 0) {
                    let messageValueSpacing = " " + messageValue.toString().toLowerCase()
                    let messageIn = false
                    answers.forEach(element => {
                        if (messageValueSpacing == element || messageValue == element) {
                            messageIn = true 
                        }
                    });

                    if (!messageIn) answers.push(messageValueSpacing)
                }
                else answers.push(messageValue)
                console.log(answers)
                message.innerText = answers
            }

            messageContainer.appendChild(message)

            chat.appendChild(avatar)
            chat.appendChild(messageContainer)
            
            const chatMain = $('section.chat-section').append(chat)
        }
        
        option.text(questions[i].pregunta)
        option.val(questions[i].respuesta)
        i++
    })
})

const otros = $('#otros')
otros.click(function() {
    for (let i = 0; i < buttons.length; i++) {
        let posicionRandom = Math.round(Math.random() * (questions.length - 1))
        buttons[i].text(questions[posicionRandom].pregunta)
        buttons[i].val(questions[posicionRandom].respuesta)
    }
})

const noSintomas = $('#noSintomas')
noSintomas.click(function() {
    buttons.forEach(option => {
        option.addClass('noshow')
    })
    otros.addClass('noshow')
    
    ChatUser(noSintomas.val())

    let isUrgency = false
    answers.forEach(answer => {
        urgencies.forEach(urgency => {
            answer = answer.toLowerCase()
            urgency = urgency.toLowerCase()
            //console.log(answer.search(urgency))
            if (answer.search(urgency) != -1) {
                isUrgency = true
            }
        })
    })

    if (isUrgency) {
        let posicionRandom = Math.round(Math.random() * (bot.length - 1))
        ChatBot(bot[posicionRandom])
    }
    else ChatBot("Lo que presentas no es una urgencia. Tu confiable DocBot te recomienda descansar")

    noSintomas.addClass('noshow')
    
    document.getElementById('btns-si-no').classList.remove('noshow')

    ChatBot("¿Desea información de un Centro de Salud?")
})

const btn_si = $('#btn-si')
const btn_no = $('#btn-no')
const again = $('#again')
btn_no.click(function() {
    ChatBot("Está bien. Cuídate mucho!! \n Gracias por usar DocBot")

    btn_si.addClass('noshow')
    btn_no.addClass('noshow')
    again.removeClass('noshow')
})

btn_si.click(function() {
    let essalud = `Hospital: ${Essalud.name}\n Número: ${Essalud.number}\n Dirrección: ${Essalud.sede}`
    ChatBot(essalud)

    let sisol = `Hospital: ${Sisol.name}\n Número: ${Sisol.number}\n Dirrección: ${Sisol.sede}`
    ChatBot(sisol)

    ChatBot("Está bien. Cuídate mucho!! \n Gracias por usar DocBot")

    btn_si.addClass('noshow')
    btn_no.addClass('noshow')
    again.removeClass('noshow')
})

again.click(function() {
    window.location.reload()
})

function ChatUser(sms) {
    const chat = document.createElement('div')
    chat.classList.add("chat", "chat--right")

    // div avatar - imagen avatar
    const avatar = document.createElement('div')
    avatar.classList.add("chat-avatar")
    const avatarImg = document.createElement('img')
    avatarImg.setAttribute('src', '/images/user.jpg')
    avatar.appendChild(avatarImg)

    // div message - messageValue
    const messageContainer = document.createElement('div')
    messageContainer.classList.add("chat-message")
    const message = document.createElement('p')

    const messageValue = sms
    message.innerText = messageValue
    messageContainer.appendChild(message)

    chat.appendChild(avatar)
    chat.appendChild(messageContainer)
    
    const chatMain = $('section.chat-section').append(chat)
}

function ChatBot(sms) {
    const chat = document.createElement('div')
    chat.classList.add("chat", "chat--left")

    // div avatar - imagen avatar
    const avatar = document.createElement('div')
    avatar.classList.add("chat-avatar")
    const avatarImg = document.createElement('img')
    avatarImg.setAttribute('src', '/images/robot 1 (1).svg')
    avatar.appendChild(avatarImg)

    // div message - messageValue
    const messageContainer = document.createElement('div')
    messageContainer.classList.add("chat-message")
    const message = document.createElement('p')

    const messageValue = sms
    message.innerText = messageValue
    messageContainer.appendChild(message)

    chat.appendChild(avatar)
    chat.appendChild(messageContainer)
    
    const chatMain = $('section.chat-section').append(chat)
}