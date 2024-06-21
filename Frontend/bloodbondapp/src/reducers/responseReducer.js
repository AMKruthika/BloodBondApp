export default function responseReducer(state,action){
    switch(action.type){
        case 'ADD_BLOODBANK_RESPONSES':{
            return {...state,responses:action.payload}
        }
        case 'SET_SERVER_ERRORS':{
            return {...state,serverErrors:action.payload}
        }
        default :{
            return state
        }
    }
}