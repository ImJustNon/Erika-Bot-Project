const text_client_tag = document.getElementById("text_client_tag");

(async() =>{
    const response = await axios.get("/api/get/client");
    text_client_tag.innerHTML = response.data.data.user.tag;
})();