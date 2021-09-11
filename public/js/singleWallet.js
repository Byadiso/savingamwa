

/* eslint-disable prettier/prettier */
document.addEventListener('DOMContentLoaded', () => {
   
    const mainSingleDiv = document.getElementById('singleMoney')
    let proId = localStorage.getItem('id');
    const success_message = document.querySelector('.success_message');
    const display_error = document.querySelector('.display_error_comment');
    let moneysItem = { ...JSON.parse(localStorage.getItem('moneys')) };
   
    let pro = []
    pro = [...pro, moneysItem]

    let Mypro = pro.find((item) => () => {
        item.money.id === proId
    })
   
    let newMoneys = Mypro.moneys;   
    // newMoneys=[...newMoneys]
      
    let findedOne = newMoneys.find((item) =>()=> item._id === proId);
    console.log(newMoneys) 
    console.log(proId)
    console.log(findedOne)
    let { description,amount,title,category, _id } = findedOne;

 

// ..................................render money ................................................

    const renderPro = () => {       
        const moneyContainer = document.createElement('DIV');       
         
                
        

    moneyContainer.innerHTML =`
                <div class="money_container" data-toAdd="${_id}">                   
                   <h4>${description}</h4>
                </div>
                 `                  
                
        
        //appending the main container
        mainSingleDiv.appendChild(moneyContainer);       

    }
   
    //  fetchingSingle();

    renderPro()
           


 //for acessing my comments reviews and description
 const descriptionCont = document.querySelector('.description_details')

 // set all content
 descriptionCont.textContent = description 
 
         
   // access user and token
    const user= JSON.parse(localStorage.getItem('user'));
    const userId = user.user._id;
    const token = user.token; 
    let moneyId =_id
             

    // ----------------------------------------------------------------------------------

    //fetching related
    const fetchingRelated = () => {
        fetch(`http://localhost:3000/api/v1/moneys/related/${proId}/`, {
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
        let moneys = data
        console.log(moneys)
        const container_related = document.createElement('DIV')
        container_related.classList.add('money_container');
        let header_related = document.createElement('h1');
        header_related.classList.add('header_related');
        header_related.textContent = 'Related money';

        // create a header for related money
        container_related.append(header_related)

        for (var i = 0; i < moneys.length; i++) {
            const { _id, name, category } = moneys[i]
            let money_related = document.createElement('div')
            money_related.classList.add('related_moneys')

            money_related.innerHTML = `<img scr=http://localhost:3000/api/v1/money/photo/${_id} class="imgCreated" style="width: 100px; height: 50px;">
         <p id="phone"><strong>name:</strong> ${name}</p>       
          `
            container_related.append(money_related)
            mainSingleDiv.appendChild(container_related)
            
        }
    }
    fetchingRelated();


// add moneys in cart 
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
    let moneysItem = { ...JSON.parse(localStorage.getItem('moneys')) } ;          
        let itemTobeAdded =  moneysItem.moneys.find((item) => () => {
        item.money.id === item_id
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
