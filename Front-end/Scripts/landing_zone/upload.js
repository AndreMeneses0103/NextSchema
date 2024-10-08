window.onload = function() {
    opcoes_roles_metadata(roles,pagina_por_role,nome_por_role)
    opcoes_roles_acoes(userData)
    info_usuario(userData)
};

let roles = JSON.parse(localStorage.getItem("roles"))
let userData = JSON.parse(localStorage.getItem("usuario"));
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
    1: "../landing_zone/lz_visualizar_metadata.html",
    2: "../bronze/bz_visualizar_metadata.html",
    3: "../silver/sv_visualizacao_metadata.html"
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
let cabecalho = false;
let arquivoSelec;
let nomeData = "";
let reqSuccess = {
    mdReq: false,
    csvReq:false,
}

let userId = userData.id;
let userName = userData.nome;

async function sendMetadata(id_empresa){
    try{
        const newMetadata = {
            nome: nomeData,
            usuario: {
                id: userId
            },
            empresa: {
                id: id_empresa
            }
        };

        const res = await api.post("http://localhost:8080/metadatas",newMetadata,{
            headers:{
                'Content-Type': 'application/json'
            }
        });

        localStorage.setItem("metadata_id", res.data.id);
        if(res.status === 200){
            reqSuccess.mdReq = true;
        }else{
            let message = "Alguma coisa deu errado. Tente novamente mais tarde.";
            let path = '/Front-end/media/images/error-img.gif'
            prompt_function(message, path)
        }
        sendCSV(arquivoSelec);
    }catch(err){
        let message = "Alguma coisa deu errado. Tente novamente mais tarde.";
        let path = '/Front-end/media/images/error-img.gif'
        prompt_function(message, path)
    }
}

async function sendCSV(file){
    try{
        const formData = new FormData();
        formData.append('file',file);
        formData.append('header', cabecalho);
        const res = await api.post("http://localhost:8080/api/upload",formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        });

        localStorage.setItem('cabecalho', res.data[0]);
        for(let x = 1; x < res.data.length; x++){
            localStorage.setItem(`dados${x}`, res.data[x]);
        }

        if(res.status === 200){
            reqSuccess.csvReq = true;
        }else{
            let message = "Alguma coisa deu errado. Tente novamente mais tarde.";
            let path = '/Front-end/media/images/error-img.gif'
            prompt_function(message, path)

        }

        if(reqSuccess.csvReq && reqSuccess.mdReq){
            window.location.href = "lz_personalizacao.html";
        }
    }catch(err){
        let message = "Alguma coisa deu errado. Tente novamente mais tarde.";
        let path = '/Front-end/media/images/error-img.gif'
        prompt_function(message, path)

    }
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



let arquivo = document.getElementById("arquivo");
arquivo.addEventListener("change", () => {
    arquivoSelec = arquivo.files[0];
    arquivo.value = "";
    firstPrompt();
});
function chamarUpload(){
    document.getElementById("arquivo").click()
}

function firstPrompt(){
    getEmpresas();

    var back = `
    <div class="back_prompt" id="back_prompt">
    </div>
    `

    var firstPrompt = `
    <div class="prompt" id="prompt">
        <div class="button_wrapper"> <!-- Envolve o botão com uma div -->
        <button class="button_close" id="fechar">
            <i class="fa-solid fa-times"></i>
        </button>
        </div>

        <span class="prompt_text">Nome do esquema:</span>
        <input type="text" class="input_data" id="input_data" placeholder="Digite aqui...">
        <span class="prompt_text">Nome da empresa:</span>
        <select class="input_data" id="input_companyname">
            <!-- Opções serão adicionadas dinamicamente aqui -->
        </select>
        <div class="btns">
            <button class="btn_p" id="btn_cont">Próximo</button>
        </div>
    </div>
        `

    document.body.insertAdjacentHTML('beforeend', back);
    let var_back = document.getElementById("back_prompt");
    var_back.insertAdjacentHTML('beforeend', firstPrompt);

    let prompt_name = document.getElementById("input_data");

    document.getElementById("btn_cont").addEventListener("click", ()=>{
        let id_empresa = input_companyname.value;
        nomeData = prompt_name.value;
        if(nomeData === ""){
            let message = "O nome do metadata não pode ser vazio.";
            let path = '/Front-end/media/images/error-img.gif'
            prompt_function(message, path)

        }else if(id_empresa === ""){
            let message = "Empresa não pode ser vazia.";
            let path = '/Front-end/media/images/error-img.gif'
            prompt_function(message, path)
        }else{
            document.getElementById("back_prompt").remove();
            validation(nomeData, id_empresa);
        }
    })

    botao_fechar();
}

function botao_fechar(){
    let botao_fechar = document.getElementById("fechar");
    let promptElement = document.getElementById("prompt");
    let backPromptElement = document.getElementById("back_prompt");

    botao_fechar.addEventListener("click", () =>{
        promptElement.remove();
        backPromptElement.remove()
    })
}

async function getEmpresas() {
    try{
        let response = await api.get(`http://localhost:8080/usuarioEmpresa/usuario/${userId}`);
        let empresas = response.data

        if(response.status === 200) {
            listEmpresas(empresas);
        }else{
            let message = "Alguma coisa deu errado. Tente novamente mais tarde.";
            let path = '/Front-end/media/images/error-img.gif'
            prompt_function(message, path)

        }
    }
    catch{
        let message = "Alguma coisa deu errado. Tente novamente mais tarde.";
        let path = '/Front-end/media/images/error-img.gif'
        prompt_function(message, path)

    }
};

function listEmpresas(empresas){
    let select_companyname = document.getElementById("input_companyname");

    empresas.forEach(empresa => {
        let option = document.createElement('option');
        option.value = empresa.id;
        option.textContent = empresa.nome;
        select_companyname.appendChild(option);
    });
}

function validation(nomeData, id_empresa) {
    const regex = /^[a-zA-Z0-9_]{6,50}$/;

    if (regex.test(nomeData)) {
        secondPrompt(id_empresa)
    }else{
        let message = "O nome do metadata não pode conter espaços e nem caracteres especiais.";
        let path = '/Front-end/media/images/error-img.gif'
        prompt_function(message, path)

    }
}

function secondPrompt(id_empresa){

    var back = `
    <div class="back_prompt" id="back_prompt">
    </div>
    `

    var secondPrompt = `
    <div class="prompt" id="prompt">
        <div class="button_wrapper"> <!-- Envolve o botão com uma div -->
            <button class="button_close" id="fechar">
            <i class="fa-solid fa-times"></i>
            </button>
        </div>
        <span class="prompt_text">O CSV contém cabeçalho?</span>
        <div class="btns">
            <button class="btn_p" id="btn_yes">Sim</button>
            <button class="btn_p" id="btn_no">Não</button>
        </div>
    </div>
    `

    document.body.insertAdjacentHTML('beforeend', back);
    let var_back = document.getElementById("back_prompt");
    var_back.insertAdjacentHTML('beforeend', secondPrompt);
    let prompt = document.getElementById("prompt");

    document.getElementById("btn_yes").addEventListener("click", ()=>{
        cabecalho = true;
        prompt.remove();
        var_back.remove();
        sendMetadata(id_empresa);
        })

        document.getElementById("btn_no").addEventListener("click", ()=>{
            cabecalho = false;
            prompt.remove();
            var_back.remove();
            sendMetadata(id_empresa);
        })
        botao_fechar();
    }

function updateNameUsuario(){
    document.getElementById("username").innerHTML = userName
}
