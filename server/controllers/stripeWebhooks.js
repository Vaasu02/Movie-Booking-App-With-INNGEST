import Stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhook=async(req,res)=>{
    const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig=req.headers['stripe-signature'];
    let event;


    try {
        event=stripe.webhooks.constructEvent(req.body,sig,process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }


    try {
        switch(event.type){
            case "payment_intent.succeeded":{
                const paymentIntent=event.data.object;
                const sessionList=await stripeInstance.checkout.sessions.list({
                    payment_intent:paymentIntent.id,
                });
                const session=sessionList.data[0];
                const{bookingId}=session.metadata;

                await Booking.findByIdAndUpdate(bookingId,{
                    isPaid:true,
                    paymentLink:"",
                });
                console.log('Payment successful for booking',bookingId);
                break;
            }
            default:
                console.log('Unhandled event type',event.type);
                
        }
        res.status(200).json({received:true})
    } catch (error) {
        console.log('Error processing webhook',error);
        res.status(500).json({success:false,message:"Error processing webhook"});
    }
}