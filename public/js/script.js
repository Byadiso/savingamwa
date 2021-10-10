      
          
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
          
          let myWallet = 0;
          let savingsMoney = 0;
          let incomesMoney = 0;
          let expensesMoney = 0;

          
         
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
                let { _id,amount,title,category} = moneys[i];            
             
               // for short  notation is the best
             
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
              
                   
         const money_details = document.querySelectorAll('.money_details');
         money_details.forEach(blockMoney => {
                  blockMoney.addEventListener('click', (e)=>{
                    // Storage()
                    let moneyBlockId = e.target.parentElement.dataset.id;
                    let saveIdToLocalStorage = localStorage.setItem('single_id', JSON.stringify(moneyBlockId))                  
                      location.href='../pages/money.html';
                                    
                   })  
                });
              }            
                
              
              // chech if localstorage have something stored already
                //get amount from localstorage and calculate my savings
              
                let amountFromLocal = JSON.parse(getItemStorage('amountTotal')); 
              if(getItemStorage('Savings') != undefined || amountFromLocal != undefined 
              ||  amountFromLocal != undefined ||  amountFromLocal != undefined ){

              
              renderToUI(savings,myWallet, amountFromLocal)

              //get individual details for expenses incomes and savings

              //for savings
              
              let amountSavedFromLocal =  JSON.parse(getItemStorage('Savings')); 
              renderToUI(savingsDisplay,savingsMoney, amountSavedFromLocal)

                 //for incomes
              let amountIncomesFromLocal =  JSON.parse(getItemStorage('Incomes')); 
              renderToUI(incomesDisplay,incomesMoney, amountIncomesFromLocal)

                //for expense
              let amountexpensesFromLocal =  JSON.parse(getItemStorage('Expenses')); 
              renderToUI(expensesDisplay,expensesMoney, amountexpensesFromLocal)
              }
              

                               
              // implementing logOut
                const logOutBtn = document.querySelector('.log-out');
                  logOutBtn.addEventListener('click', ()=>{
                    console.log('plz I am out')
                  localStorage.clear();
                  window.location.href = '../pages/login.html';
              })

              // category page run
              const category_details = document.querySelectorAll('.category_details');
              category_details.forEach(blockMoney => {
                  blockMoney.addEventListener('click', (e)=>{
                    // Storage()
                    let categoryBlockId = e.target.dataset.category;    
                                  
                    let saveCategoryToLocalStorage = localStorage.setItem('category-details', JSON.stringify(categoryBlockId))                  
                      location.href='../pages/category.html';
                                    
                   })  
                });

            
               listAll();


            //function to calculate total
            function getTotal(amountArray){
              let array = []
              array.push(amountArray)
              console.log(array)
              return array.reduce((previousValue, currentValue) => previousValue + currentValue)
            }

            //funciton get items form local
            function getItemStorage(item){             
              return JSON.parse(localStorage.getItem(item));           
            }

            //function set items to local storage
            function setItemStorage(arrayMoney, titleMoney, amountMoney){
              arrayMoney.push(amountMoney)
              localStorage.setItem(titleMoney , JSON.stringify(arrayMoney));  
             
            }

            //render item to ui
            function renderToUI(render,amount, amountFromLocal ){  
              if(amountFromLocal == undefined){
                return
              }   
              else {
                amount = getTotal(amountFromLocal)                           
                render.innerHTML = amount + " Rwf"
               }    
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
            };



            //list by user 
          const userId= JSON.parse(localStorage.getItem('user')).user._id; 
          console.log(userId);
          const listByMe = () => {
            return  fetch(`http://localhost:3000/api/v1/moneys/${userId}`)
             .then((resp) =>resp.json())
             .then((data) =>  {
             console.log(data);
             localStorage.setItem('moneysByUser', JSON.stringify(data));
           });             
             }
           listByMe();      
          })
          
          
          
          
          
          
          
          
          
              
     

 