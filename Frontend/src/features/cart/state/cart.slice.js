import {createSlice} from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name:'cart',
    initialState:{
        items:[],
        totalPrice:0,
        currency:'INR'
    },
    reducers:{
        setCart:(state,action)=>{
            const cart = action.payload
            state.items = cart?.items || []
            state.totalPrice = cart?.totalPrice || 0
            state.currency = cart?.currency || 'INR'
        },
        addItem:(state,action)=>{
            const item = action.payload
            state.items.push(item)
            const price = Number(item.price?.amount || item.price || 0)
            state.totalPrice += price * (item.quantity || 1)
        },
        incrementItemQuantity:(state,action)=>{
           const { productId, variantId } = action.payload
           const item = state.items.find(i => String(i.productId?._id || i.productId) === productId && String(i.variantId) === variantId)

           if (item) {
               item.quantity += 1
               const price = Number(item.price?.amount || item.price || 0)
               state.totalPrice += price
           }
        },
        decrementItemQuantity:(state,action)=>{
            const { productId, variantId } = action.payload
            const item = state.items.find(i => String(i.productId?._id || i.productId) === productId && String(i.variantId) === variantId)

            if (item && item.quantity > 1) {
                item.quantity -= 1
                const price = Number(item.price?.amount || item.price || 0)
                state.totalPrice -= price
            }
       },
       removeItem:(state,action)=>{
            const { productId, variantId } = action.payload
            const item = state.items.find(i => String(i.productId?._id || i.productId) === productId && String(i.variantId) === variantId)
            if (item) {
                const price = Number(item.price?.amount || item.price || 0)
                state.totalPrice -= price * item.quantity
                state.items = state.items.filter(i => !(String(i.productId?._id || i.productId) === productId && String(i.variantId) === variantId))
            }
       }
    }
})

export const {setCart, addItem, incrementItemQuantity, decrementItemQuantity, removeItem} = cartSlice.actions
export default cartSlice.reducer