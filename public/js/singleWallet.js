

/* eslint-disable prettier/prettier */
document.addEventListener('DOMContentLoaded', () => {
   
    const mainSingleDiv = document.getElementById('singleProperty')
    let proId = localStorage.getItem('id');
    console.log(proId);
    const success_message = document.querySelector('.success_message');
    const display_error = document.querySelector('.display_error_comment');
    let propertiesItem = { ...JSON.parse(localStorage.getItem('properties')) };
    let cart_items = 1;
    let pro = []
    pro = [...pro, propertiesItem]

    let Mypro = pro.find((item) => () => {
        item.Property.id[0] === proId
    })

    let newPro = Mypro.properties;    
    let findedOne = newPro.find((item) => item._id === proId);
    let { description, shipping, reviews, comments, _id } = findedOne;

 

// ..................................render property ................................................

    const renderPro = () => {       
        const propertyContainer = document.createElement('DIV');       
        let photoUrl = `http://localhost:3000/api/v1/property/photo/${proId}`;     
       let isIncart = checkInCart(_id);

      
       
        

    propertyContainer.innerHTML =`
                <div class="property_container" data-toadd="${_id}">
                    <img src=${photoUrl} class="imgCreated" style="width: 350px; height: 400px;">
                    <button class="btn_addCart"><i class="fas fa-shopping-cart"></i>${isIncart ? "In Cart": "Add to cart"}</button>
                </div>
                 `  
                 
                
        
        //appending the main container
        mainSingleDiv.appendChild(propertyContainer);       

        //  trying to addToCart butto a even listenenre
         const btns = document.querySelectorAll('.btn_addCart');         
         btns.forEach((btn)=>{
              //disable add to cart button
              isIncart ?  btn.setAttribute('disabled', false) : btn.removeAttribute('disabled');          

              // add event listener
             btn.addEventListener('click', (event)=>{  
                let item_id = event.target.parentNode.dataset.toadd;
                let buttonAddToCart =  event.target;               
                addToCart(item_id, buttonAddToCart );                    
             });
         });
      
        


    function addToCart(item_id, buttonContent){                
            let cart=[];     
            let propertiesItem = {...JSON.parse(localStorage.getItem('properties'))};           
            let newPro = propertiesItem.properties;            
            let itemTobeAdded = newPro.find((item) => item._id === item_id);           
                        
   
            if (typeof window !== 'undefined') {
                if (localStorage.getItem('cart')) {
                    cart = JSON.parse(localStorage.getItem('cart'));
                }
                cart.push({
                    ...itemTobeAdded,
                    count: 1
                });  
        
                // remove duplicates
                // build an Array from new Set and turn it back into array using Array.from
                // so that later we can re-map it
                // new set will only allow unique values in it
                // so pass the ids of each object/product
                // If the loop tries to add the same value again, it'll get ignored
                // ...with the array of ids we got on when first map() was used
                // run map() on it again and return the actual product from the cart
        
                cart = Array.from(new Set(cart.map(p => p._id))).map(id => {
                    return cart.find(p => p._id === id);
                });
             
                localStorage.setItem('cart', JSON.stringify(cart));                             
                buttonContent.innerHTML=`<i class="fas fa-shopping-cart"></i>In cart`;
               
               
                const cart_items_container = document.querySelectorAll(".cart-items");

                cart_items_container.forEach((cart_item_number)=>{
                    cart_item_number.textContent = cart.length + cart_items
                });                                             
          }
        }
        


         //check in cartlogic
    function checkInCart(id) {
             let stateInCart = false ;
            if (typeof window !== 'undefined') {
                if (localStorage.getItem('cart')) {
                  let cartIn = [...JSON.parse(localStorage.getItem('cart'))];
                   
                  let cartArray = []
                   cartArray = [...cartArray,cartIn]
                 
                 let newCart = cartArray[0]
                 newCart.forEach((item)=>{
                       if(item._id === id){
                        stateInCart = true;
                        return stateInCart
                       }
                       return ;                   
                   })                      
    
                }
            }

            return stateInCart

        }    
    }

    //  fetchingSingle();

    renderPro()
            


 //for acessing my comments reviews and description
 const descriptionCont = document.querySelector('.description_details')
 const ShippingCont = document.querySelector('.shipping_details')
 const reviewsCont = document.querySelector('.reviews_details')
 const commentsCont = document.querySelector('#comment_details_container')

 // set all content
 descriptionCont.textContent = description
 ShippingCont.textContent =
     shipping == true
         ? 'Please remember to update your address in order to deliver you product at your door'
         : 'Sorry this is not delivable product'
 reviewsCont.textContent =
     reviews.length == 0
         ? 'No Reviews found!'
         : reviews.map((review) => {
               const reviewsContainer = document.createElement('div')
               reviewsContainer.innerHTML = ` <p>${review}</p>
 <p>${review.postedBy.name}</p>
 `
           })

 // ...........................comment section......................................................
 const comment_details_header = document.querySelector(
     '.comment_details_header'
 )
 comment_details_header.textContent = comments.length

 // condition to for rendering a text if no comments and if there are comments show them

 if (comments.length == 0) {
     return 'No comments to dislay'
 } else {
     renderComments()
 }

 // render my comments
 function renderComments() {
     for (var i = 0; i < comments.length; i++) {
         let user_loggin  = { ...JSON.parse(localStorage.getItem('user')) }        
         const { text, _id, createdBy, created } = comments[i]
         const comentContainer = document.createElement('div')
         comentContainer.innerHTML = `        
        <div class="comment_details" data-comment="${text}">
             <p class="comment" >${text}</p>
             <p class="posted_by">Posted by ${ createdBy.name }</p>   
             <p class="date_posted">Comented on ${ created }</p>
        </div>
        
         ${user_loggin.user._id == createdBy._id ? `<button class="btn-delete">delete</button>` : ''}
        <hr />`
        commentsCont.append(comentContainer)
     }

     
   // access user and token
    const user= JSON.parse(localStorage.getItem('user'));
    const userId = user.user._id;
    const token = user.token; 
    let propertyId =_id
             


     //uncomment 
     const deleteComment_btn = document.querySelectorAll('.btn-delete');

     deleteComment_btn.forEach(Btn => {    
            Btn.addEventListener('click', (e)=>{
                        // const comments = document.querySelector('.comment')[0];
                        let comment_created = e.target.parentNode.children[0].dataset.comment
                        console.log(comment_created)
                        return fetch(`http://localhost:3000/api/v1/property/uncomment/`, {
                            method: "PUT",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify( { userId , propertyId, comment: {text: comment_created} })
                        })
                .then(data => {
                    // console.log(data)
                    if(data.status == true){
                                          
                       success_message.innerHTML = `<h3>Your comment has been successfully removed</h3>`
                      //  location.reload();
                      
                    } 
                    if(data.status == false){
                      console.log(data.error)
                      display_error.innerHTML = data.error
                    }         
                  })
                .catch(err => console.log(err));  
               
                 })
 
               });

    }
    

    // ----------------------------------------------------------------------------------

    //fetching related
    const fetchingRelated = () => {
        fetch(`http://localhost:3000/api/v1/properties/related/${proId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => renderRelated(data))
    }

    function renderRelated(data) {
        console.log(data)
        let properties = data
        console.log(properties)
        const container_related = document.createElement('DIV')
        container_related.classList.add('property_container');
        let header_related = document.createElement('h1');
        header_related.classList.add('header_related');
        header_related.textContent = 'Related Property';

        // create a header for related property
        container_related.append(header_related)

        for (var i = 0; i < properties.length; i++) {
            const { _id, name, category } = properties[i]
            let property_related = document.createElement('div')
            property_related.classList.add('related_properties')

            property_related.innerHTML = `<img scr=http://localhost:3000/api/v1/property/photo/${_id} class="imgCreated" style="width: 100px; height: 50px;">
         <p id="phone"><strong>name:</strong> ${name}</p>       
          `
            container_related.append(property_related)
            mainSingleDiv.appendChild(container_related)
            
        }
    }
    fetchingRelated();




// add properties in cart 
document.body.addEventListener( 'click', function ( event ) { 

    if( event.target && event.target.matches(".btn_addCart")) {            
        let item_id = event.target.parentNode.dataset.id;
        let buttonAddToCart =  event.target;                     
        addToCart(item_id, buttonAddToCart ); 
       console.log("clicked to be added ")
             
    };
  } );


function addToCart(item_id, buttonContent){ 
    let cart=[];     
    let propertiesItem = { ...JSON.parse(localStorage.getItem('properties')) } ;          
        let itemTobeAdded =  propertiesItem.properties.find((item) => () => {
        item.Property.id === item_id
    });            
    console.log("let add to the cart");            
    cart.push({
        ...itemTobeAdded,
        count: 1
    });   
    localStorage.setItem('cart', JSON.stringify(cart));             
    buttonContent.innerHTML=`<i class="fas fa-shopping-cart"></i>In cart`
    console.log(cart);  
    
}



//  //check property in cart
//  function checkIfInCart (id){
//     let storedInCarrt = JSON.parse(localStorage.getItem('cart'))
//     let cart = document.querySelectorAll(".cart-items")[0];
//     if(){

//     }
//     cart.textContent = storedInCarrt.length;

//     let isInCart= storedInCarrt.find(item =>item._id == id);
//     if(isInCart){
        
//         let button = document.querySelector('.btn_addCart');
//         button.innerHTML=`<i class="fas fa-shopping-cart"></i> In cart`;
//         button.setAttribute('disabled',true);
//  }
// }





            // time display in readable format
            var timestamp= timeDifference(new Date(), new Date(createdAt));
            
            function timeDifference(current, previous) {
                var msPerMinute = 60 * 1000;
                var msPerHour = msPerMinute * 60;
                var msPerDay = msPerHour * 24;
                var msPerMonth = msPerDay * 30;
                var msPerYear = msPerDay * 365;
            
                var elapsed = current - previous;            
                if (elapsed < msPerMinute) {
                    if(elapsed/1000 <30) return "Just now";
            
                    return Math.round(elapsed/1000) + ' seconds ago';   
                }
            
                else if (elapsed < msPerHour) {
                     return Math.round(elapsed/msPerMinute) + ' minutes ago';   
                }
            
                else if (elapsed < msPerDay ) {
                     return Math.round(elapsed/msPerHour ) + ' hours ago';   
                }
            
                else if (elapsed < msPerMonth) {
                    return Math.round(elapsed/msPerDay) + ' days ago';   
                }
            
                else if (elapsed < msPerYear) {
                    return Math.round(elapsed/msPerMonth) + ' months ago';   
                }
            
                else {
                    return Math.round(elapsed/msPerYear ) + ' years ago';   
                }
            }


})
