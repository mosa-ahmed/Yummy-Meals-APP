$(document).ready(function(){
    $('.loading').fadeOut(500,function(){
        $(this).remove()
        $('body').css('overflow','auto')
    })
})

// OPEN OR CLOSE SIDEBAR
$('#openCloseIcon').click(function(){
    let timeToOpen = 500

    if($(this).is('.fa-align-justify')){
        $(this).removeClass('fa-align-justify').addClass('fa-x')
        $('.left').animate({'left':'0'},500)
        $('.right').animate({'left':$('.left').innerWidth()+'px'},500)

        $('.left nav ul li').each(function(){
            $(this).animate({'top':'0','opacity':'1'},timeToOpen)
            timeToOpen+=200
        })
    }else{
        $(this).removeClass('fa-x').addClass('fa-align-justify')
        $('.left').animate({'left':'-'+$('.left').innerWidth()+'px'},500)
        $('.right').animate({'left':'0'},500)

        $('.left nav ul li').each(function(){
            $(this).animate({'top':'300px','opacity':'0'})
        })
    }
})


// GET DATA FROM API AND DISPLAY DATA
let list = []
async function mealsSearch(currentSearch){
    const apiRequest = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${currentSearch}`)
    const finalData = await apiRequest.json()
    list = finalData.meals
    console.log(list);
    displayMeals(list)
    return list
}

mealsSearch('')

// DISPLAY MEALS
function displayMeals(meals){
    if(meals){
            let cartona = ''
            for(let i = 0; i < meals.length; i++){
                cartona += ` <div class="col-md-3">
                                <div class="meal position-relative rounded-2 overflow-hidden" onclick="getDetails(${meals[i].idMeal})">
                                    <img src="${meals[i].strMealThumb}" class="w-100" alt="">
                                    <div class="meal-layer position-absolute d-flex align-items-center p-2 text-dark">
                                        <h3>${meals[i].strMeal}</h3>
                                    </div>
                                </div>
                             </div>`
            }
            $('#rowData').html(cartona)
    }

}

// LOOKUP FULL MEAL DETAILS BY ID API
async function getDetails(id){
    const apiRequest = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    const finalData = await apiRequest.json()
    list = finalData.meals
    console.log(list[0]);
    displayDetailsOfMeal(list[0])
    
}

// DISPLAY DETAILS OF MEAL
function displayDetailsOfMeal(meal){
    const cartona = ` <div class="col-md-4 text-white">
                        <img src="${meal.strMealThumb}" class="w-100 rounded-2" alt="">
                        <h1>${meal.strMeal}</h1>
                      </div>
                      <div class="col-md-8 text-white">
                        <h2>Instructions</h2>
                        <p>${meal.strInstructions}</p>
                        <p><span class="fw-bolder" style="font-size:25px">Area : </span>${meal.strArea}</p>
                        <p><span class="fw-bolder" style="font-size:25px">Category : </span>${meal.strCategory}</p>
                        <h3>Recipes :</h3>
                        <ul class="d-flex flex-wrap list-unstyled" id="recipes">
                        </ul>
                        <h3 class="my-2">Tags :</h3>
                        <ul class="d-flex flex-wrap list-unstyled" id="tags">
                        </ul>
                        <a href="${meal.strSource}" target="_blank" class="btn btn-success text-white">Source</a>
                        <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger text-white">Youtube</a>
                      </div>`

    $('#rowData').html(cartona)
    displayIngredients(meal)
    displayTags(meal)
}

// DISPLAY INGREDIENTS
function displayIngredients(meal){
    let ingredients = ''

    for(let i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients += `<li class="my-3 mx-1 px-2 py-1 alert alert-success rounded">${meal[`strIngredient${i}`]}</li>`
        }
    }
    $('#recipes').html(ingredients)
}

// DISPLAY TAGS
function displayTags(meal){
    let tags = ''
    const theTags = meal.strTags?.split(',')
    if(theTags){
        for(let i = 0; i < theTags.length; i++){
        tags += `<li class="my-3 mx-1 px-2 py-1 alert alert-danger rounded">${theTags[i]}</li>`
    }
    $('#tags').html(tags)
    }

}

// CHOOOOOOSE THE DISPLAY
$('.navbar-list li a').click(chooseDisplay)

async function chooseDisplay(e){
    const link = $(e.target).data('link')

    $('#rowData').html('')
    $('#search').html('')

    if(link == 'search'){
        search()
    }

    if(link == 'categories'){
        const categoriesList = await getSidebarContents(`${link}.php`)
        list = categoriesList.categories.splice(0,20)
        displayCategoriesList()
    }

    if(link == 'area'){
        const areasList = await getSidebarContents('list.php?a=list')
        list = areasList.meals.splice(0,20)
        displayArea()
    }

    if(link == 'ingredients'){
        const ingredientsList = await getSidebarContents('list.php?i=list')
        list = ingredientsList.meals.splice(0,20)
        displayIngredientsList()
    }

    if(link == 'contactUs'){
        contactUs()



    }


    $('#openCloseIcon').click()
}

// SWARCH DISPLAY
function search(){
    $('#search').html(`
                    <div class="row mt-5 gy-2 gx-5 text-center">
                        <div class="col-md-6">
                            <input type="search" class="form-control" placeholder="Search By Name" id="searchByName">
                        </div>
                        <div class="col-md-6">
                            <input type="search" maxLength="1" class="form-control" placeholder="Search By First Letter..." id="searchByFirstLetter">
                        </div>
                    </div>`)

   $('#searchByName').keyup(function() {
       let currentSearch = $(this).val();
       mealsSearch(currentSearch)
   })

   $('#searchByFirstLetter').keyup(function(){
        let letter = $(this).val()
        searchLetter(letter)
   })
}

//SEARCH BY FIRST LETTER
async function searchLetter(searchLetter){
    if(searchLetter){
        const apiRequest = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${searchLetter}`)
        const finalData = await apiRequest.json()
        console.log(finalData.meals);
        list = finalData.meals
        displayMeals(list)
    }else{
        $('#rowData').html(`<h2 class="text-center">No Data to Show!</h2><img src="images/logo.png" class="w-25 mx-auto" alt="">`)
    }
}

// GET SIDEBAR CONTENTS
async function getSidebarContents(categoryList){
    const catList = await fetch(`https://www.themealdb.com/api/json/v1/1/${categoryList}`)
    const finalcatList = await catList.json()
    return finalcatList
}

// DISPLAY CATEGORIES LIST
function displayCategoriesList(){
    let cartona = ''
    for(let i = 0; i < list.length; i++){
        cartona += ` <div class="col-md-6 col-lg-3 my-3 shadow text-center">
                        <div class="position-relative pb-2 shadow overflow-hidden content" onclick="categoryMeals('${list[i].strCategory}')">
                            <img src='${list[i].strCategoryThumb}' class="w-100 rounded"/>
                            <div class="layer rounded position-absolute text-dark">
                                <div class="mt-0">
                                    <h2>${list[i].strCategory}</h2>
                                    <p>${list[i].strCategoryDescription.split(' ').slice(0,15).join(' ')}</p>
                                </div>
                            </div>
                        </div>
                    </div>`
    }
    $('#rowData').html(cartona)
}

// DISPLAY CATEGORY DETAILS
async function categoryMeals(categoryId){
    const apiRequest = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryId}`)
    const finalData = await apiRequest.json()
    list = finalData.meals
    displayMeals(finalData.meals)
}

// DISPLAY AREA
function displayArea(){
    let cartona = ''
    for(let i = 0; i < list.length; i++){
        cartona += ` <div class="col-md-6 col-lg-3 my-3 shadow text-center">
                        <div class="rounded position-relative shadow overflow-hidden content pb-2">
                            <div onclick="areaDetails('${list[i].strArea}')">
                                <i class="fa-solid fa-city fa-3x pb-1"></i>
                                <h2 class="text-white">${list[i].strArea}</h2>
                            </div>
                        </div>
                    </div>`
    }
    $('#rowData').html(cartona)
}

// DISPLAY AREA DETAILS
async function areaDetails(area){
    const apiRequest = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    const finalData = await apiRequest.json()
    list = finalData.meals.slice(0,20)
    displayMeals(list)
}

// DISPLAY INGREDIENTS LIST
function displayIngredientsList(){
    let cartona = '';
    for (var i = 0; i < list.length; i++){
         cartona += `
                <div class="col-md-6 col-lg-3 my-3 p-1 shadow text-center"> 
                    <div class="shadow content rounded" onclick="ingredientsDetails('${list[i].strIngredient}')">
                        <div class="pb-2 px-2">
                            <i class="fa-solid fa-bowl-food fa-3x"></i>
                            <h2 class="text-white">${list[i].strIngredient}</h2>
                            <p class="text-white">${list[i].strDescription.split(" ").splice(0,20).join(" ")}</p>
                        </div>
                    </div>
                </div>`
}
    $('#rowData').html(cartona);
}

// DISPLAY INGRDIENTS DETAILS
async function ingredientsDetails(ingredient){
    const apiRequest = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    const finalData = await apiRequest.json()
    list = finalData.meals
    displayMeals(finalData.meals)
}

// CONTACT US
function contactUs(){
    $('#rowData').html(`    
<section class="contact-us mb-5 px-5" id="contactUs">
    <div class="container w-75 text-center">
       <h2>Contact Us...</h2>
       <form id="formData">
          <div class="row mt-4 gy-3">
             <div class="col-md-6">
                <div class="form-content">
                   <input type="text" placeholder="Enter Your Name" class="form-control" name="name"/>
                   <p class="alert alert-danger p-2 d-none">Special Characters and Numbers not allowed</p>
                </div>
             </div>
             <div class="col-md-6">
                <div class="form-content">
                   <input type="email" placeholder="Enter Email" class="form-control"name="email"/>
                   <p class="alert alert-danger p-2 d-none">Enter valid email. *Ex: xxx@yyy.zzz</p>
                </div>
             </div>
             <div class="col-md-6">
                <div class="form-content">
                   <input type="tel" placeholder="Enter Phone" class="form-control" name="tel"/>
                   <p class="alert alert-danger p-2  d-none">Enter valid Phone Number</p>
                </div>
             </div>
             <div class="col-md-6">
                <div class="form-content">
                   <input type="number" placeholder="Enter Age" class="form-control" name="number"/>
                   <p class="alert alert-danger p-2  d-none">Enter Age Between 18 and 99</p>
                </div>
             </div>
             <div class="col-md-6">
                <div class="form-content">
                   <input type="password" placeholder="Enter Password" class="form-control"name="password"/>
                   <p class="alert alert-danger p-2  d-none">Enter valid password *Minimum eight characters, at least one letter and one number:*</p>
                </div>
             </div>
             <div class="col-md-6">
                <div class="form-content">
                   <input type="password" placeholder="Enter RePassword" class="form-control"/>
                   <p class="alert alert-danger p-2 d-none">Enter valid Repassword</p>
                </div>
             </div>
          </div>
          <button type="submit" class="btn btn-outline-danger mt-4" id="submit" disabled>Submit</button>
       </form>
    </div>
 </section>`)

     // VALIDATION FORM
     const validation = {
        regexName: /^[a-zA-z][a-zA-z\s]{1,}$/,
        regexEmail:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        regexPhoneNumber: /^(002)?01[0125]\d{8}$/,
        regexAge: /^([1-9][0-9]|100)$/,
        regexPassword: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    
        checkValidation: function(regex,number){
            if(regex.test($('.contact-us input').eq(number).val())){
                $('.contact-us input').eq(number).next().addClass('d-none')
                $('.contact-us input').eq(number).removeClass('is-invalid').addClass('is-valid')
                return true
            }else{
                $('.contact-us input').eq(number).next().removeClass('d-none')
                $('.contact-us input').eq(number).removeClass('is-valid').addClass('is-invalid')
                return false
            }
        },
    
        checkRePassword: function(){
            if($('.contact-us input').eq(4).val() == $('.contact-us input').eq(5).val()){
                $('.contact-us input').eq(5).next().addClass('d-none')
                $('.contact-us input').eq(5).addClass('is-valid').removeClass('is-invalid')
                return true
            }else{
                $('.contact-us input').eq(5).next().removeClass('d-none')
                $('.contact-us input').eq(5).addClass('is-invalid').removeClass('is-valid')
                return false
            }
        }
        }
    
        let {regexName, regexEmail, regexPhoneNumber, regexAge, regexPassword} = validation
    
        // FORM EVENT VALIDATION
        $('#formData').keyup(function(){
            if(validation.checkValidation(regexName, 0) && validation.checkValidation(regexEmail, 1) && 
                validation.checkValidation(regexPhoneNumber, 2) && validation.checkValidation(regexAge, 3) &&
                    validation.checkValidation(regexPassword, 4) && validation.checkRePassword())
            {
                $('#submit').attr('disabled',false)
            }else{
                $('#submit').attr('disabled',true)
            }
        })
}


