## -- check-order --   ##
Function works with 2 cases if email and ID required:    
1) If we say Check order in the chat - > It is neccessary to provide id and email    
2) If we say Check order by email in the chat It is neccessary to provide only email    
  
Also if we set only ID required it works as expected:  
1) If we say Check order in the chat - > It is neccessary to provide id or email  

## -- cancel-order --  ##
Function can requires 2 fields:  
1) order-id  
2) confirmed (It is true if order is found and user confirmed cancelling)  
Works properly  

## -- application-form --  ##
Works properly and collect required email and name  
But sometimes the function worked without collecting email and name  
