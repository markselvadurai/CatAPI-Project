const categorySelect = document.getElementById("category");
const getButton = document.getElementById("get-button");
const getfavButton = document.getElementById("get-favourites");
const gallery = document.querySelector(".gallery");
const API_URL = "https://api.thecatapi.com";
const API_KEY = "live_Wdh3ntzb3Nz63dVeO3uJZOrIkXcQWPUwDu6RiaS3BNh4STVa6V9qJdY3XfLuAS8d";

// Add your code here

// console.log(API_URL + '/v1/categories');

getcategories();

async function getcategories() {
  const response = await fetch('https://api.thecatapi.com/v1/categories', { headers: { 'x-api-key': API_KEY } });
  const data = await response.json();
  // console.log(data);
  data.forEach(element => {
    let newelement = document.createElement('option');
    newelement.value = element.id;
    newelement.textContent = element.name;
    categorySelect.appendChild(newelement);
  });
}

async function getCats(id) {
  const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=9&category_ids=' + id, { headers: { 'x-api-key': API_KEY } });
  const data = await response.json();

  data.forEach((element, index) => {
    let newdiv = document.createElement('div');
    // console.log('created div');
    newdiv.className = 'gallery-item';
    let catpic = document.createElement('img');
    catpic.src = data[index].url;
    catpic.id = data[index].id;

    newdiv.appendChild(catpic);
    gallery.appendChild(newdiv);

    const heart = document.createElement("span");
    heart.classList.add("heart");
    heart.innerHTML = "&#x2764;";
    newdiv.addEventListener("click", addToFavourite);
    newdiv.appendChild(heart);
    console.log("Image ID: " + data[index].id);

  });
}

getButton.addEventListener('click', function () {
  gallery.innerHTML = '';
  let catid = (categorySelect.value);
  getCats(catid);
})

getfavButton.addEventListener('click', function () {
  gallery.innerHTML = '';
  getFav();
})

/* Bonus */


// You'll need to append the heart and add an eventlistener to each image parent (div) when you create it. Here is the code to do that. You might have to modify it a bit differently if you used a different variable name.




/* Uncomment below for the bonus, this is the function that will be called when you click each image. I've used e.currentTarget instead of e.target because it's more reliable. I would encourage you to google it and read about it to understand the differences. */


async function addToFavourite(e) {
  var favoriteid;
  const currentTarget = e.currentTarget;
  const imageid = e.currentTarget.firstChild.id;
  e.currentTarget.classList.toggle("showheart");
  console.log("addToFavourite ran: ", e.currentTarget);
  console.log(e.currentTarget.firstChild.id);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("x-api-key", API_KEY);

  var raw = JSON.stringify({
    "image_id": imageid,
    "sub_id": 'aaspoa'
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  console.log(e.currentTarget);
  if (currentTarget.classList.contains("showheart")) {
    var response = await fetch("https://api.thecatapi.com/v1/favourites", requestOptions)
    data = await response.json();
    console.log(data);
    console.log('favorited');
    
    currentTarget.firstChild.dataset.favoriteid = data.id;
  }

  if (!currentTarget.classList.contains("showheart")) {
    console.log(currentTarget.firstChild.favoriteid);
    var deleteOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };
    var response = await fetch("https://api.thecatapi.com/v1/favourites/" + currentTarget.firstChild.dataset.favoriteid, deleteOptions)
    data = await response.json();
    console.log(data);
    console.log('unfavorited');
  }

  var GETOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  var dentist = await fetch("https://api.thecatapi.com/v1/favourites?sub_id=aaspoa", GETOptions)
  data = await dentist.json();
  console.log(data);

}


async function getFav() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("x-api-key", API_KEY);

  var GETOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  var response = await fetch("https://api.thecatapi.com/v1/favourites?sub_id=aaspoa", GETOptions)
  favdata = await response.json();
  console.log(favdata);
  
  for(let i = favdata.length - 1; i >= favdata.length - 9; i--)
  {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    var response = await fetch("https://api.thecatapi.com/v1/images/"+favdata[i].image_id, requestOptions);
    data = await response.json();
    console.log(data);
    let newdiv = document.createElement('div');
    // console.log('created div');
    newdiv.className = 'gallery-item';
    let catpic = document.createElement('img');
    catpic.src = data.url;
    catpic.id = data.id;

    newdiv.appendChild(catpic);
    gallery.appendChild(newdiv);

    const heart = document.createElement("span");
    heart.classList.add("heart");
    heart.innerHTML = "&#x2764;";
    newdiv.addEventListener("click", addToFavourite);
    newdiv.appendChild(heart);
    console.log("Image ID: " + data.id);
  }
}