
const commands_grid_element = document.getElementById("commands_grid");

const input_search_command = document.getElementById("input_search_command");

(async() =>{
    await FirstLoad();

    input_search_command.addEventListener("keyup", async({key}) =>{
        if(key.toLowerCase() !== "enter") return;
        const query = input_search_command.value;
        await SearchCommand(query);
    });
})();



async function FirstLoad(){
    const get_commands_data = await axios.get("/api/get/commands");
    commands_grid_element.innerHTML = MakeCard(get_commands_data.data.data.commands);
}


async function SearchCommand(query){
    const response = await axios.get("/api/get/commands");
    const searchCommand = response.data.data.commands.filter(c => !c.name.indexOf(query));
    commands_grid_element.innerHTML = MakeCard(searchCommand);
    searchCommand.length !== 0 ? notyf.success(`Found : ${searchCommand.length} Commands`) : notyf.error(`Command Not Found`);
}


function copyToClipboard(commandName){
    navigator.clipboard.writeText(commandName);
    console.log("Copy to Clipboard : Success : " + commandName);
    notyf.success("Copy to Clipboard : Success");
}


function MakeCard(commandDataArray){
    let addGrid = "";
    commandDataArray.forEach(c => {
        let cardTemp = `
        <div class="card w-64 glass text-dark cursor-pointer" onclick="copyToClipboard('/${c.name}')">
            <div class="card-body items-center text-center">
                <h2 class="card-title">${c.name}</h2>
                <p>${c.description}</p>
            </div>
        </div>`;
        addGrid += cardTemp;
    });
    return addGrid;
}   