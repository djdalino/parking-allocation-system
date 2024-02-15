'use client'
import { get } from 'http';
import * as React from 'react'


const VEHICHLE_TYPE = ['S', 'M', 'L'];
const FLAT_HOUR = 3
const FLAT_RATE = 40;
const EXCEED_RATE = 5000;
const EXCEED_HOUR = 24
const PARKING_RATE = [20, 60, 100]
const AVAILABLE_PARKING = [
  {
    id: 0,
    name: 'Small Parking', 
    distancesUnit: [1,2,3],
    size: 0, 
    isAvailable: false
  },
  {
    id: 1,
    name: 'Medium Parking', 
    distancesUnit: [1,2,3],
    size: 1, 
    isAvailable: false,
  },
  {
    id: 2,
    name: 'Large Parking', 
    distancesUnit: [1,2,3],
    size: 2,
    isAvailable: false,
  },
  {
    id: 3,
    name: 'Large Parking', 
    distancesUnit: [1,2,3],
    size: 2,
    isAvailable: false,
  },
  {
    id: 4,
    name: 'Medium Parking', 
    distancesUnit: [1,2,3],
    size: 1, 
    isAvailable: false,
  },
]


export default function Home() {
  const [parkedVehicle, setParkedVehicle] = React.useState<any>([])
  const [vehicleType, setVehicleType] = React.useState<number>(0)
  const [parkingFee, setParkingFee] = React.useState<number>(0)
  const [availableSlot, setAvailableSlot] = React.useState<any>(AVAILABLE_PARKING)

  const handleParkedVehicle = () => {
    const currentDate = new Date();
    // const dateOffset = (24*60*60*1000) * 1;
   
    // currentDate.setTime(currentDate.getTime() - dateOffset);
    // console.log({currentDate})
    const findSlot = handleParkedOnAvailableSlot(vehicleType)
    if(findSlot === null){
      alert('Slot is taken')
      return;
    }
    setParkedVehicle([...parkedVehicle, {id: findSlot.slot.id ,vehicelSize: VEHICHLE_TYPE[vehicleType], parkingSlot: findSlot.slot.size, entryTime: currentDate }])
    setAvailableSlot(
      availableSlot.map((slot: any, index: number) => slot.size === findSlot.slot.size && index === findSlot.index ? {...slot, isAvailable: true, vehicleType: VEHICHLE_TYPE[vehicleType], entryTime: currentDate} : slot))
    setParkingFee(0)
  }

  const handleParkedOnAvailableSlot = (vehicleType: number) => {
    for(let [index, slot] of availableSlot.entries()) {
      if(slot.size >= vehicleType && !slot.isAvailable){
        const occupied = parkedVehicle.some((parked: any, i: number) => parked.parkingSlot === slot.size && slot.id === parked.id)
        if(!occupied) return {index, slot}
      }
    }
    return null
  }

const handleFormatDate = (date:any) => {
  if(date === undefined || date === '') return ''
  const day = date?.getDate();
  const month = date?.getMonth() + 1; 
  const year = date?.getFullYear();
  const hours = date?.getHours();
  const minutes = date?.getMinutes();
  const seconds = date?.getSeconds();

  const pad = (value:any) => {
    return value < 10 ? '0' + value : value;
  };

  return `${pad(month)}/${pad(day)}/${year} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

  const handleUnparkedVehicle = (rateIndex: number, index: number) => {
    const dateToday: any = new Date()
    const parkingRatePerSize = PARKING_RATE[rateIndex]
    setAvailableSlot(availableSlot.map((slot: any, i: number) => slot.size === rateIndex && slot.id === index ? {...slot, isAvailable: false, vehicleType: VEHICHLE_TYPE[vehicleType], entryTime: ''} : slot))
    const findPark = parkedVehicle.find((park: any, i: number) => park.id === index)
    const getParkedTime = Math.round((dateToday - findPark?.entryTime) / (1000*60*60)) 

    if(getParkedTime > FLAT_HOUR){
      setParkingFee(parkingRatePerSize * getParkedTime)
    } else {
      setParkingFee(FLAT_RATE)
    }
    if(getParkedTime > EXCEED_HOUR){
      const getDays = Math.floor(getParkedTime/EXCEED_HOUR)
      const excessHour = Math.round(getParkedTime % EXCEED_HOUR)
      const computeExceed = (EXCEED_RATE * getDays) + (parkingRatePerSize * excessHour)
      
      // console.log({getParkedTime,EXCEED_HOUR,computeExceed, getDays, excessHour})
      setParkingFee(computeExceed)

    }
    setParkedVehicle(parkedVehicle.filter((parked: any, i: number) => parked.id != index))
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2">
      <div className="text-center">

        <div>
          <p className='text-3xl font-bold'>Parking Allocation System</p>

          <p className='mb-4'>Flat rate of 40 pesos for the first three (3) hours</p>
          <div className='mb-4'>
            <p> - 20/hour for vehicles parked in SP;</p>
            <p>- 60/hour for vehicles parked in MP; and</p>
            <p>- 100/hour for vehicles parked in LP </p>
          </div>
          
          <p className='text-3xl font-bold mb-1'>Available Slot</p>
          <div className='flex flex-col mb-5 md:flex-row  items-center'>
            {availableSlot.sort((a: any,b: any) => a.size - b.size).map((slot: any, index: number) => {
              return (
                <div key={`${slot.size}-${index}`} className='py-2 px-3 mx-2 max-w-full w-[250px] md:mb-0 mb-5' >
                  <p className='pill'>{slot.name}</p>
                  <p>{slot.isAvailable ? 'Taken' : 'Available'} {slot.isAvailable ? slot.vehicleType : ''}</p>
                  <p>Time: {handleFormatDate(slot?.entryTime)}</p>
                  <p>
                      <button 
                      className={`${!slot.isAvailable ? 'bg-gray-500' : 'bg-red-500'} py-2 px-4 rounded-md text-white`} 
                      onClick={() => handleUnparkedVehicle(slot.size, slot.id)}
                      disabled={!slot.isAvailable}
                      >
                        Unpark Vehicle
                      </button>
                    </p>
                </div>
              )
            })}
          </div>
        </div>

        <p className='text-xl mb-5'>Parking Fee: {parkingFee?.toString()}</p>
        <div>
          <label>Select Vehicle Type:</label>
          <select className='text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] mx-auto p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={vehicleType} onChange={(e) => setVehicleType(parseInt(e.target.value))}>
          <option selected>Choose a Car type</option>
            <option value={0}>Small</option>
            <option value={1}>Medium</option>
            <option value={2}>Large</option>
          </select>

          
        </div>
        <div className='flex gap-2 mx-auto items-center justify-center mt-5'>
          <button className='bg-blue-500 py-2 px-4 w-[200px] rounded-md text-white' onClick={handleParkedVehicle}>Park Vehicle</button>
        </div>
        
      </div>
    </main>
  );
}
