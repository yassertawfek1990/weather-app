
async function getWeather(city) {
        console.log(city)
        let y = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&key=SYVPH3DS5QMHS2HYF4TMMAZ6F&contentType=json`
        const response = await fetch(y, {mode: 'cors'})
        console.log(response)
        const data = await response.json()
        console.log(data["days"])
        console.log(data["days"][0])
        return data["days"]
    }
    

let returnedData;

const checkbox = document.getElementById('myCheckbox');
let degree = false
// Check if the checkbox is checked
checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        degree = true
        console.log(`Checkbox is ${degree}`);
        getTop(returnedData[0],degree)
        getBottom(returnedData,degree)

    } else {
        degree = false
        console.log(`Checkbox is ${degree}`);
        getTop(returnedData[0],degree)
        getBottom(returnedData,degree)

    }
        
})
let form = document.querySelector("form")
form.addEventListener("keydown", async (event) => {
    // Cancel the default action, if needed
    if (event.key === "Enter") {
        event.preventDefault();
        let input = document.querySelector("input");
        let city = document.querySelector("header div p");
        city.innerHTML = "";
        city.innerHTML = input.value;
        input.value = "";
        console.log(input);

        // Use await to wait for the asynchronous function to resolve
        returnedData = await getWeather(city.innerHTML.toLowerCase());
        console.log(returnedData[0]);

        // Pass the returned data to other functions
        getTop(returnedData[0], degree);
        getBottom(returnedData, degree);
       
    }
});

function getTop(obj,degree){
    let top = document.querySelector(".top")
    top.innerHTML = ""
    let keys = {1:"icon",2:"temp",3:"conditions",4:"tempmax",6:"tempmin",5:"feelslike",7:"humidity",9:"snow",8:"precip"}
    let titles = {4:"Highest Temp",6:"Lowest Temp",5:"Feels Like",7:"Humidity",9:"Snow",8:"Rain chances"}
    let count = 1

    for (let i = 1;i <=5;i++){
        // let name  = 
        let div = document.createElement('div');
        div.setAttribute("class",`top${i}`)
        for (let x = 1;x <=2;x++){
            if(i == 1 && x==1){
                let image = obj["icon"]
                document.querySelector("body").setAttribute("class",image)
                let img = document.createElement('img');
                img.setAttribute("src",`images/${image}.png`)
                div.appendChild(img);
                count++
        
            }
            else if(i==2){
                let h3 = document.createElement('h2');
                h3.innerHTML = count==2?(degree?((obj[keys[count]]* 1.8) + 32).toFixed(1) :obj[keys[count]])+"&deg;":obj[keys[count]]
                div.appendChild(h3);
                count++
        
            }
            else if (i!=1){
                let p = document.createElement('p');
                p.innerHTML = `${titles[count] }: <span> ${titles[count]  =="Rain chances"? (obj[keys[count]]* 100).toFixed(2) + '%':["Highest Temp","Lowest Temp","Feels Like"].includes(titles[count] )?degree?((obj[keys[count]]* 1.8) + 32).toFixed(1)+"&deg;":obj[keys[count]]+"&deg;":obj[keys[count]]+"%"}<span>`
                div.appendChild(p);
                count++
        
            }
        }

        top.appendChild(div);
    
    }
}


function getcard(obj,tag,degree){
    let keys = {1:"datetime",2:"icon",3:"tempmax",4:"tempmin",5:"conditions"}
    let count = 1
    for (let i = 1;i <=4;i++){
        let div = document.createElement('div');
        div.setAttribute("class",`card${i}`)
        if(i==1) {
            const datetime = obj[keys[count]]
            const date = new Date(datetime);

            const options = { weekday: 'short', day: 'numeric' }; // Format options for Thu 30
            const formattedDate = date.toLocaleDateString('en-US', options);

            // console.log(formattedDate); // Output: Thu 30
            let p = document.createElement('p');
            p.innerHTML = formattedDate
            div.appendChild(p);
            count++

        }
            
            else if(i==2){
                let image = obj[keys[count]]
                let img = document.createElement('img');
                img.setAttribute("src",`images/${image}.png`)
                div.appendChild(img);
                count++
            }
            else if(i==3){
                let p1 = document.createElement('p');
                p1.innerHTML = (degree?((obj[keys[count]]* 1.8) + 32).toFixed(1) :obj[keys[count]])+"&deg;"
                div.appendChild(p1);
                count++
                let p2 = document.createElement('p');
                p2.innerHTML = (degree?((obj[keys[count]]* 1.8) + 32).toFixed(1) :obj[keys[count]])+"&deg;"
                div.appendChild(p2);
                count++
            }
            else {
                let p = document.createElement('p');
                p.innerHTML = obj[keys[count]]
                div.appendChild(p);
                count++
            }
            tag.appendChild(div);
        }
}
function getBottom(data,degree){
    let slider = document.querySelector(".slider")
    slider.innerHTML = ""

    data.forEach(element=>{
        let tag = document.createElement('div');
        tag.setAttribute("class","tag")
        getcard(element,tag,degree)
        slider.appendChild(tag)
    })
}

(async () => {
    try {
        let returnedData = await getWeather("berlin");
        getTop(returnedData[0],degree)
        getBottom(returnedData,degree)

        console.log(returnedData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
})();

// Dynamically calculate visible items based on screen width
function calculateVisibleCount() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 480) return 2;
    if (screenWidth <= 768) return 3;
    if (screenWidth <= 1024) return 5;
    return 7;
}

const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
let currentIndex = 0;
// Update slider position
function updateSlider() {
    const slider = document.querySelector('.slider');
    const items = document.querySelectorAll('.tag');


    
    let visibleCount = calculateVisibleCount();
    const itemWidth = items[0].offsetWidth;
    const maxIndex = items.length - visibleCount;
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
    const offset = (currentIndex * itemWidth)+(currentIndex * 10);
    slider.style.transform = `translateX(-${offset}px)`;
    console.log(currentIndex)
    console.log(itemWidth)
}

// Event listeners for navigation
nextButton.addEventListener('click', () => {
    currentIndex++;  
    updateSlider();
  });
  
prevButton.addEventListener('click', () => {
    currentIndex--;
    updateSlider();
});

// Recalculate visible count on window resize
window.addEventListener('resize', () => {
    visibleCount = calculateVisibleCount();
    updateSlider();
});

updateSlider();


  