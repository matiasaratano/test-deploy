

class ListaEsperaController {
    constructor() { }

     createListaEspera = async (req, res) => {
        try {
            // Verificamos la disponibilidad de asientos en la oficina
            const reservasExistente = await Reserva.count();
            if (reservasExistente >= 24) {
                // No hay asientos disponibles, entonces agregamos al usuario a la lista de espera
                const listaEspera = await ListaEspera.create({

                });
                return res.status(200).send({ success: true, message: 'No hay asientos disponibles. Agregado a la lista de espera.' });
            }

            //Uso una instancia del controlador ReservaController
            const reservaController = new ReservaController();
            const result = await reservaController.createReserva(req, res);

        } catch (error) {
            console.error(error);
            res.status(500).send({ success: false, message: 'Error al agregar a la lista de espera.' });
        }
    }


    getAllListaEspera = async (req,res) => {
        try {
            res.status(200).send({ success: true, message: "User" });

        }
        catch (error) {
            res.status(400).send({ success: false, message: error.message })
        }
    }



    getListaEsperaById = async (req,res) => {
        try {
            res.status(200).send({ success: true, message: "User" });

        }
        catch (error) {
            res.status(400).send({ success: false, message: error.message })
        }
    }



    updateListaEspera = async (req,res) => {
        try {
            res.status(200).send({ success: true, message: "User" });

        }
        catch (error) {
            res.status(400).send({ success: false, message: error.message })
        }
    }

    
    deleteListaEspera = async (req,res) => {
        try {
            res.status(200).send({ success: true, message: "User" });

        }
        catch (error) {
            res.status(400).send({ success: false, message: error.message })
        }
    }

}

export default ListaEsperaController