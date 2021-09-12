
 
/* eslint-disable prettier/prettier */
document.addEventListener('DOMContentLoaded', () => {

    
   
    const mainSingleDiv = document.getElementById('singleMoney')
    let moneyIdFrom = localStorage.getItem('single_id');
    const success_message = document.querySelector('.success_message');
    const display_error = document.querySelector('.display_error_comment');
    let moneysItems = JSON.parse(localStorage.getItem('moneys')) ;

    let pro = moneysItems.moneys
   
    console.log(pro)
    
    

      
    let findedOne = pro.find((item) =>()=> item._id === moneyIdFrom);
    
    console.log(findedOne._id)
    console.log(moneyIdFrom)
    let { description,amount,title,category,createdAt, _id } = findedOne; 

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

// ..................................render money ................................................

    const renderPro = () => {       
        const moneyContainer = document.createElement('DIV');     
                      
         moneyContainer.innerHTML =`
                <div class="money_container">    
                   <h5>${title}</h5>               
                   <h5>${description}</h5>                   
                   <h5>${category.name}</h5>
                   <h5>${amount}</h5>
                   <h5>Added ${timestamp}</h5>
                   <div class=" btns_category" data-toAdd="${_id}">
                        <buton class="btn_edit">Edit</buton>
                        <buton class="btn_delete">Delete</buton>
                   </div>
                   
             </div>
                 `      
                 
          
        //appending the main container
        mainSingleDiv.appendChild(moneyContainer);       

    }
   
    //  fetchingSingle();

    renderPro()
           
         
   // access user and token
    const user= JSON.parse(localStorage.getItem('user'));
    const userId = user.user._id;
    const token = user.token; 
    let moneyId =_id
             

    // ----------------------------------------------------------------------------------

    //fetching related
    const fetchingRelated = () => {
        fetch(`http://localhost:3000/api/v1/moneys/related/${moneyId}/`, {
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
        container_related.append(header_related);

        for (var i = 0; i < moneys.length; i++) {
            const { _id, amount } = moneys[i]
            let money_related = document.createElement('div');
            money_related.classList.add('related_moneys');
            money_related.innerHTML = renderUIPart(_id, title, amount)
            container_related.append(money_related);
            mainSingleDiv.appendChild(container_related);            
        }
    }
    fetchingRelated();

       // this is a  function to other part of the pages    
    
  function renderUIPart(id,title,amount){
    return `
    <div class="money_details" data-id="${id}">                                        
        <div class="item_money>
            <p id="title"> ${title}<span class="amount"> ${amount + " "}PLN</span></p>   
        </div>                                            
    </div>               
  `
}

document.getElementById('singleMoney').addEventListener('click',(event)=> {
    if (event.target.className === 'btn_edit') { 
        console.log('Clicked! yes it is edit btn');
        let propId = event.target.parentElement.dataset.toadd;
        console.log(propId)
              console.log('soon i am going to udpate you friend ' + propId);    
              let data_user = {
                prop_id: propId,
                user_id: _id,
                token : token
              }
              localStorage.setItem('id_user_to_update', JSON.stringify(data_user));   
              let stored = localStorage.getItem('id'); 
              stored ? location.href='../pages/update.html' : console.log('no stored id to update');
       
      } else if(event.target.className === 'btn_delete'){
        let propId = event.target.parentElement.dataset.toadd;
        console.log('soon i am going to delete you friend ' + propId);    
        let data_to_be_updated = {
          prop_id: propId,
          user_id: _id,
          token : token
        }
        localStorage.setItem('id_to_update', JSON.stringify(data_to_be_updated));   
        let stored = JSON.parse(localStorage.getItem('id_to_deleted')); 
        stored ? location.href='../pages/myBugdet.html' : console.log('no stored id to delete');
      }
})




})
