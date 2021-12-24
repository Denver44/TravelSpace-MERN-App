import express from "express"
import fs from 'fs'
import path from 'path'
import morgan from "morgan"

const app = express()
const PORT = 5000;

app.use(morgan('dev'))
app.use(express.json())

app.use((req, res, next) => {
    console.log("Hello from Middleware 👋");
    next();
})

app.use((req, res, next) => {
    req.requestedTime = new Date().toISOString()
    next();
})

const __dirname = path.resolve(path.dirname(''));
let tours = [];
tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        requestedTime: req.requestedTime,
        result: tours.length,
        data: {
            tours
        }
    })
}
const getATour = (req, res) => {
    const { id } = req.params
    const tour = tours.find(el => el.id === id * 1)

    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid Id",
        })
    }
    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    })
}
const createATour = (req, res) => {
    const { body } = req
    const id = tours[tours.length - 1].id + 1;
    const tour = { ...body, id }
    tours = [...tours, tour];
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: "created",
            data: {
                tour
            }
        })
    })
}
const updateATour = (req, res) => {
    const { body } = req
    const id = req.params.id
    const tour = tours.find(el => el.id === id * 1)


    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid Id",
        })
    }

    let updatedTour = tours.find(el => el.id === id * 1)
    let filteredTour = tours.filter((el) => el.id !== id * 1)
    updatedTour = { id: id * 1, ...body }
    tours = [...filteredTour, updatedTour];

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(200).json({
            status: "updated",
            data: {
                tour: updatedTour
            }
        })
    })
}
const deleteATour = (req, res) => {
    const id = req.params.id
    const tour = tours.find(el => el.id === id * 1)

    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid Id",
        })
    }

    let filteredTour = tours.filter((el) => el.id !== id * 1)
    tours = [...filteredTour];

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(204).json({
            status: "success"
        })
    })
}

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "route for this endpoint is not defined yet"
    })
}
const createAUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "route for this endpoint is not defined yet"
    })
}
const getAUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "route for this endpoint is not defined yet"
    })
}
const updateAUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "route for this endpoint is not defined yet"
    })
}
const deleteAUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "route for this endpoint is not defined yet"
    })
}





const tourRouter = express.Router()
const userRouter = express.Router()

tourRouter.route('/').get(getAllTours).post(createATour)
tourRouter.route('/:id').get(getATour).patch(updateATour).delete(deleteATour)

userRouter.route('/').get(getAllUsers).post(createAUser)
userRouter.route('/:id').get(getAUser).patch(updateAUser).delete(deleteAUser)

// This is called Mounting a Router and the order should be like this only.
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)


app.listen(PORT, () => {
    console.log(`server is started http://localhost:${PORT}`);
})


// Here actually we have mounted router.