const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BarberSchema = new Schema({
    masterPhone: {
        type: String,
        required: true,
    },
    stylists: [
        {
            number: {
                type: String,
                default: ""
            },
            permisionByBarber: {
                type: Boolean,
                default: false
            },
            stylistIsReady: {
                type: Boolean,
                default: false
            },
            isMaster: {
                type: Boolean,
                default: false
            },

            _id: false,

        },

    ],
    barberName: {
        type: String,
        default: "",
    },
    barberPhone: {
        type: String,
        default: ""
    },

    licenseNumber: {
        type: String,
        default: "",
    },
    Men: {
        type: Boolean,
        default: true,
    },
    barberCity: {
        type: String,
        default: "",
    },
    barberArea: {
        type: String,
        default: "",
    },
    barberAddress: {
        type: String,
        default: "",
    },
    barberPhoto: {
        type: String,
        default: "https://images.unsplash.com/photo-1524230616393-d6229fcd2eff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGJhcmJlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=400&q=60",
    },
    show: {
        type: Boolean,
        default: false,
    },
    ban: {
        type: Boolean,
        default: false
    },
    rating: {
        barberDesign: {
            quantity: {
                type: Number,
                default: 1
            },
            rate: {
                type: Number,
                default: 5
            },
        },
        accessible: {
            quantity: {
                type: Number,
                default: 1
            },
            rate: {
                type: Number,
                default: 5
            },
        },
    }

}, { versionKey: false });

module.exports = mongoose.model("Barber", BarberSchema);

