
/* eslint-disable prettier/prettier */
document.addEventListener('DOMContentLoaded', ()=> { 
              
    // for accessing only my form to create a property    
    const display_error = document.querySelector('.display_error_category');  
    const categories_container = document.querySelector('.category_container');

        
 // --------------------------fetching moneys and category details or type------------------------------------------------------------
 const category_details= JSON.parse(localStorage.getItem('category-details'));
 const moneys= JSON.parse(localStorage.getItem('moneys'));
 console.log(category_details)
 console.log(moneys)

 const sameCategory = moneys.moneys.filter((item=> item.category.name.toLowerCase() === category_details.toLowerCase() )) 
 console.log(sameCategory)
    // ..............................render all catgories............................


  const categoriesHeader =document.createElement('h3');
   categoriesHeader.textContent = sameCategory.length +" " + category_details ;
   categories_container.append(categoriesHeader);
  
  for (var i = 0; i <sameCategory.length ; i++){
    const {title,amount, _id} = sameCategory[i]    
    const maindiv = document.createElement('div');
    maindiv.classList.add('item_money')
    maindiv.innerHTML= `
    <div class="money_details" data-id="${_id}">                                        
      <div class="item_money>
          <p id="title"> ${title}<span class="amount"> ${amount + " "}PLN</span></p>   
      </div>                                            
    </div>`;    
    categories_container.append(maindiv); 
}     
    
});


  
  
  