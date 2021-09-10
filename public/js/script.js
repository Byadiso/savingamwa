      
          
document.addEventListener('DOMContentLoaded', () => {     
          
          const ordersMsg = document.getElementById('header-text');  
          const mainDiv = document.getElementById('myMoneys'); 
          const searchBar = document.getElementById('searchBar'); 
          const savings = document.querySelector('#saving');
          const savingsDisplay = document.querySelector('#savings');
          const incomesDisplay = document.querySelector('#incomes');
          const expensesDisplay = document.querySelector('#expenses');
          let moneys = [] ;   
          let walletAmount = []; 
          let savingsAmount = []; 
          let incomesAmount = []; 
          let expensesAmount = []; 
          
          let myWallet;
          let savingsMoney;
          let incomesMoney;
          let expensesMoney;

          
         
          //function to fetch all dat from backend

          const listAll = () => {
           return  fetch('http://localhost:3000/api/v1/moneys')
            .then((resp) =>resp.json())
            .then((data) =>  {
            renderProperty(data);
            localStorage.setItem('moneys', JSON.stringify(data));
          });
            
          }

          // function to render my property
          function  renderProperty(dataPro) {          
              console.log(dataPro);             

               ordersMsg.className = 'err';
              ordersMsg.innerHTML = dataPro.message;
                moneys= dataPro.moneys;                  
              for ( var i= 0; i < moneys.length; i++ ){            
                let  divprop= document.createElement("DIV"); 
                let { _id,amount,title,description,category,createdAt} = moneys[i];                 
                
             


               // for short  notation is the best
               var timestamp= timeDifference(new Date(), new Date(createdAt));
                divprop.innerHTML =`
                <div class="money_details" data-id="${_id}">                                        
                  <div class="item_money>
                      <p id="title"> ${title}<span class="amount"> ${amount + " "}PLN</span></p>   
                  </div>                                            
                </div>`
                

              //save amount in localstorage

              //adding negative sign to amount for expenses
              if(category.name.toLowerCase() =="expenses"){ 
                amount = -amount                  
                console.log(amount + "some shit")
                walletAmount.push(amount)  
              }else {
                walletAmount.push(amount)  
              }
                         
              localStorage.setItem('amountTotal', JSON.stringify(walletAmount));


                 //save all transaction in locastorage savings               
                 if(category.name.toLowerCase() =="savings"){                                 
                  savingsAmount.push(amount)
                  localStorage.setItem('Savings', JSON.stringify(savingsAmount));  
                  console.log(savingsAmount)  
                  

                }else if (category.name.toLowerCase() =="income"){                 
                  incomesAmount.push(amount)  
                  localStorage.setItem('Incomes', JSON.stringify(incomesAmount)); 
                  console.log(incomesAmount)   
                } else if(category.name.toLowerCase() =="expenses") {
                  expensesAmount.push(amount)  
                  localStorage.setItem('Expenses', JSON.stringify(expensesAmount));
                  console.log(expensesAmount)  
                }
                          
               
              
                   
        // add a class for a right border
          if(category.name.toLowerCase() =="income"){
            divprop.classList.add("income")
          } else if(category.name.toLowerCase() =="savings"){
            divprop.classList.add("savings")
          }         
          else {
            divprop.classList.add("expenses")
          }
          // to append my whole create section   
          mainDiv.append(divprop);   
               
              }   
              
                   
         const viewBtns = document.querySelectorAll('.btn-view');
         viewBtns.forEach(Btn => {
                  Btn.addEventListener('click', (e)=>{
                    // Storage()
                    let propId = e.target.parentElement.dataset.id;
                    localStorage.setItem('id', propId)
                    console.log(propId);
                    location.href='../pages/singleProperty.html';
                  })
  
                });
              }            
             
              
              //get amount from localstorage and calculate my savings
              let amountFromLocal =JSON.parse(localStorage.getItem('amountTotal'));            
              myWallet = getTotal(amountFromLocal)                           
              savings.innerHTML = myWallet

              //get individual details for expenses incomes and savings

              //for savingas
              let amountSavedFromLocal = getItemStorage('Savings'); 
              savingsMoney = getTotal(amountSavedFromLocal)                           
              savingsDisplay.innerHTML = savingsMoney + " PLN"

                 //for incomes

                //for expense


                               
              // implementing logOut
                const logOutBtn = document.querySelector('.log-out');
                  logOutBtn.addEventListener('click', ()=>{
                    console.log('plz I am out')
                  localStorage.clear();
                  window.location.href = '../pages/login.html';
              })
              
               listAll();

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

            //function to calculate total
            function getTotal(amountArray){
              return amountArray.reduce((previousValue, currentValue) => previousValue + currentValue)
            }

            //funciton get items form local
            function getItemStorage(item){             
              return JSON.parse(localStorage.getItem(item));           
            }

            //render item to ui

            function renderToUI(item){          
              savingsMoney = getTotal(amountSavedFromLocal)                           
              savingsDisplay.innerHTML = savingsMoney + " PLN"
            }


      
          })
          
          
          
          
          
          
          
          
          
              
     

 