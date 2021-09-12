
/* eslint-disable prettier/prettier */
document.addEventListener('DOMContentLoaded', ()=> { 
              
    // for accessing only my form to create a property    
    const display_error = document.querySelector('.display_error_category');  
    const categories_container = document.querySelector('.all_categories');

    
 // --------------------------------------------------------------------------------------
      const user= JSON.parse(localStorage.getItem('user'));
      const id = user.user._id;
      const token = user.token; 

    // ..............................render all catgories............................

function renderAllCategories (cat){
  const categoriesHeader =document.querySelector('.all_category_header');
   categoriesHeader.textContent = cat.length;

  for (var i = 0; i <cat.length ; i++){
    const {name, _id} = cat[i]
    const category = document.createElement('div');
    category.classList.add('category_item');    
    category.innerHTML= `<di data-id=${_id} class="category_item">
      <h3>${name}</h3>
      <button class="btn-delete">delete</button>
    </di>
    
       
    `;
  }
}     
    
});


  
  
  