let user = JSON.parse(localStorage.getItem("usuario"));

window.onload = () => {
    opcoes_roles_metadata(roles,pagina_por_role,nome_por_role)
    opcoes_roles_acoes(userData)
    info_usuario(userData)
    initialize()
};

let usuario = localStorage.getItem("usuario");
let roles = JSON.parse(localStorage.getItem("roles"))
let userData = JSON.parse(localStorage.getItem("usuario"));

let select = document.getElementById("select-filter1");
let select2 = document.getElementById("select-filter2");
let token = JSON.parse(localStorage.getItem("token"))

const api = axios.create({
    baseURL:`http://localhost:8080`,
    headers: {
        'Authorization': `Bearer ${token}`
    }
})


function opcoes_roles_acoes(userData){
    let table = document.querySelector(".upload");
    for (let i in userData.roleUsuario){
        if (userData.roleUsuario[i] === "ROLE_LZ"){
            var listar_metadata = `
            <li><a href="../landing_zone/lz_upload.html">Upload CSV</a></li>
        `;
        table.insertAdjacentHTML("beforeend", listar_metadata);
        }
    }
}

let pagina_por_role = {
    0: "../admin/homeAdmin.html",
    1: "../landing_zone/homeUser.html",
    2: "../bronze/bz_visualizar_metadata.html",
    3: "../silver/",
}
let nome_por_role= {
    0: "Adminstrador",
    1: "Landing Zone",
    2: "Bronze",
    3: "Silver",
}

function info_usuario(userData){
    namespace = document.getElementById("user_name").textContent = userData.nome
}

function opcoes_roles_metadata(roles,pagina_por_role,nome_por_role) {
    let table = document.querySelector(".metadatas");

    for (let chave in roles) {
        enum_role = roles[chave]
        let rota = pagina_por_role[enum_role];
        let nome = nome_por_role[enum_role];

        if(roles[chave] == "ROLE_LZ"){
            var listar_metadata = `
            <li><a href="${pagina_por_role[1]}">${nome_por_role[1]}</a></li>
        `;
            table.insertAdjacentHTML("beforeend", listar_metadata);
        }else if(roles[chave] == "ROLE_BRONZE"){
            var listar_metadata = `
            <li><a href="${pagina_por_role[2]}">${nome_por_role[2]}</a></li>
        `;
            table.insertAdjacentHTML("beforeend", listar_metadata);
        }else if(roles[chave] == "ROLE_SILVER"){
            var listar_metadata = `
            <li><a href="${pagina_por_role[3]}">${nome_por_role[3]}</a></li>
        `;
            table.insertAdjacentHTML("beforeend", listar_metadata);
        }  
    }
}

async function initialize() {
    try {
        const empresas = await getEmpresas();
        if (empresas) {
            generateEmpresas(empresas);
        }
    } catch (error) {
        let message = "Alguma coisa deu errado. Tente novamente mais tarde.";
        let path = '/Front-end/media/images/error-img.gif'
        prompt_function(message, path)

    }
}

async function getEmpresas() {
    try {
        let response = await api.get(`/empresas`);
        if(response.status === 200) {
            return response.data;
        } else {
            let message = "Alguma coisa deu errado. Tente novamente mais tarde.";
            let path = '/Front-end/media/images/error-img.gif'
            prompt_function(message, path)
            return null;
        }
    } catch(error) {
        let message = "Alguma coisa deu errado. Tente novamente mais tarde.";
        let path = '/Front-end/media/images/error-img.gif'
        prompt_function(message, path)
        return null;
    }
}

async function getMetadata(id) {
    try {
        let response = await api.get(`/metadatas/empresa/${id}`);
        if(response.status === 200) {
            return response.data;
        } else {
            let message = "Alguma coisa deu errado. Tente novamente mais tarde.";
            let path = '/Front-end/media/images/error-img.gif'
            prompt_function(message, path)
            return null;
        }
    } catch(error) {
        let message = "Alguma coisa deu errado. Tente novamente mais tarde.";
        let path = '/Front-end/media/images/error-img.gif'
        prompt_function(message, path)

        return null;
    }
}

async function getHistorico(id){
    try {
        let response = await api.get(`/historicos/metadata/${id}`);

        if(response.status === 200) {
            generateTable(response.data);
        } else {
            let message = "Alguma coisa deu errado. Tente novamente mais tarde.";
            let path = '/Front-end/media/images/error-img.gif'
            prompt_function(message, path)
            return null;
        }
    } catch(error) {
        let message = "Alguma coisa deu errado. Tente novamente mais tarde.";
        let path = '/Front-end/media/images/error-img.gif'
        prompt_function(message, path)

        return null;
    }
}

function generateEmpresas(empresas){
    if(empresas !== null){
        for(let i = 0; i < empresas.length; i++){
            let selectOptions = `
                <option class="option" onchange="" id="select${i}" value="${empresas[i].id}">${empresas[i].nome}</option>
            `
            select.insertAdjacentHTML("afterbegin", selectOptions);
        }
    }
};

function generateMetadatas(metadatas){
    select2.innerHTML = "";
    select2.insertAdjacentHTML("afterbegin", `<option value="" disabled selected hidden>Selecionar</option>`)
    for(let i = 0; i < metadatas.length; i++){
        let selectOptions2 = `
            <option class="option" id="select${i}" value="${metadatas[i].id}">${metadatas[i].nome}</option>
        `
        select2.insertAdjacentHTML("afterbegin", selectOptions2);
    }
}

select.addEventListener("change", async function () {
    if(select.value !== "") {
        try {
            let mt = await getMetadata(select.value);
            if (mt) {
                select2.disabled = false;
                generateMetadatas(mt);
                generateTable([])
            }
        } catch (error) {
            console.error(error);
        }
    }
});

select2.addEventListener("change", function () {
    if(select2.value !== ""){

        getHistorico(select2.value)
    }
});

function generateTable(dados) {
    let table = document.getElementById("body_dados");
    table.innerHTML = "";
    for (let x = 0; x < dados.length; x++) {
        let dadosTable = `
        <tr>
            <td>${formatDateNative(dados[x].data_hora)}</td>
            <td>${dados[x].email_usuario}</td>
            <td>${dados[x].log}</td>
        </tr>`;
        table.insertAdjacentHTML("afterbegin", dadosTable);
    }
}


function updateNameUsuario() {
    document.getElementById("username").innerHTML = user.nome;
}

function formatDateNative(dateString) {
    if (!dateString) return ""; // Verifica se dateString é null ou vazio

    const cleanDateString = dateString.substring(0, 23) + 'Z';
    const date = new Date(cleanDateString);
    return date.toLocaleString('pt-BR', { timeZone: 'UTC' });
}

function prompt_function(message, path) {
    var back = `
    <div class="back_prompt" id="back_prompt">
    </div>
    `;

    var prompt_function= `
        <div class="prompt1" id="prompt">
            <img src="${path}" style="width: 35%">
            <span class="prompt_text">${message}</span>
            <div class="btns">
                <button class="btn_p" id="btn_OK">OK</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", back);
    let var_back = document.getElementById("back_prompt");
    var_back.insertAdjacentHTML("beforeend", prompt_function);

    document.getElementById("btn_OK").addEventListener("click", () => {
        document.getElementById("back_prompt").remove();
        document.getElementById("prompt").remove();
    });
}
