      
          
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
                   setItemStorage(savingsAmount, 'Savings', amount); 
                }else if (category.name.toLowerCase() =="income"){  
                  setItemStorage(incomesAmount, 'Incomes', amount);
                } else if(category.name.toLowerCase() =="expenses") {   
                  setItemStorage(expensesAmount, 'Expenses', amount);
                }
                          
               
              
                   
                  // add a class function for a right border
                  addClassBorderToMyWallet( "income", "savings",category, divprop )
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
              
              let amountFromLocal = getItemStorage('amountTotal'); 
              renderToUI(savings,myWallet, amountFromLocal)

              //get individual details for expenses incomes and savings

              //for savings
              let amountSavedFromLocal = getItemStorage('Savings'); 
              renderToUI(savingsDisplay,savingsMoney, amountSavedFromLocal)

                 //for incomes
              let amountIncomesFromLocal = getItemStorage('Incomes'); 
              renderToUI(incomesDisplay,incomesMoney, amountIncomesFromLocal)

                //for expense
              let amountexpensesFromLocal = getItemStorage('Expenses'); 
              renderToUI(expensesDisplay,expensesMoney, amountexpensesFromLocal)

                               
              // implementing logOut
                const logOutBtn = document.querySelector('.log-out');
                  logOutBtn.addEventListener('click', ()=>{
                    console.log('plz I am out')
                  localStorage.clear();
                  window.location.href = '../pages/login.html';
              })
              
               listAll();

            // time display in readable format
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

            //function set items to local storage
            function setItemStorage(arrayMoney, titleMoney, amountMoney){
              arrayMoney.push(amountMoney)
              localStorage.setItem(titleMoney , JSON.stringify(arrayMoney));  
              console.log(arrayMoney)  
            }

            //render item to ui
            function renderToUI(render,amount, amountFromLocal ){          
              amount = getTotal(amountFromLocal)                           
              render.innerHTML = amount + " PLN"
            }

            //add class function and i am not putting expense cos I am not interested in that
            function addClassBorderToMyWallet( income, savings,category, render ){
                if(category.name.toLowerCase() ==income){
                  render.classList.add("income")
                } else if(category.name.toLowerCase() == savings){
                  render.classList.add("savings")
                }         
                else {
                  render.classList.add("expenses")
                }
            }

      
          })
          
          
          
          
          
          
          
          
          
              
     

 