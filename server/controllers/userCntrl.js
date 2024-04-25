import asyncHandler from "express-async-handler";
import { prisma } from "../config/PrismaConfig.js";

export const createUser = asyncHandler(async (req, res) => {
  console.log("Creating a new user");

  try {
    const { email } = req.body;
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (!userExists) {
      const user = await prisma.user.create({ data: req.body });
      res.status(201).json({
        message: "User registered successfully",
        user: user,
      });
    } else {
      res.status(400).json({ message: "User already registered" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export const bookVisit = asyncHandler(async (req, res) => {
  console.log("Booking a visit to the residency");

  try {
    const { email, date } = req.body;
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    if (user.bookedVisits.some((visit) => visit.id === id)) {
      res
        .status(400)
        .json({ message: "This residency is already booked by you" });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisits: { push: { id, date } },
        },
      });
      res.status(200).json({ message: "Your visit is booked successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// function to get all the booking of a user
export const allBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });
    res.status(200).send(bookings);
  } catch (err) {
    throw new Error(err.message);
  }
});

//function to cancel the booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });

    const index = user.bookedVisits.findIndex((visit) => visit.id === id);

    if (index === -1) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      user.bookedVisits.splice(index, 1);
      await prisma.user.update({
        where: {email},
        data: {
            bookedVisits: user.bookedVisits
        }
      })
    }
    res.send("Booking cancelled successfull");
  } catch (err) {
    throw new Error(err.message);
  }
});


//function to add a residency in favourite list of a user

export const toFav = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { rid } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (user.favResidenciesID.includes(rid)) {
            const updatedUser = await prisma.user.update({
                where: { email },
                data: {
                    favResidenciesID: {
                        set: user.favResidenciesID.filter((id) => id !== rid)
                    }
                }
            });
            res.json({ message: "Removed from favourites", user: updatedUser });
        } else {
            const updatedUser = await prisma.user.update({
                where: { email },
                data: {
                    favResidenciesID: {
                        push: rid
                    }
                }
            });
            res.json({ message: "Updated favourites", user: updatedUser });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//Fucntion to get all favourites
export const allFav = asyncHandler(async(req,res) => {
    const {email} = req.body;
    try{
       const favResd = await prisma.user.findUnique({
        where: {email},
        select: {favResidenciesID: true}
       })
       res.status(200).send(favResd);
    }catch(err){
        throw new Error(err.message);
    }
})