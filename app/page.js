// 'use client'

// import { useState, useEffect, useCallback } from 'react'
// import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
// import { firestore } from '@/firebase'
// import {
//   collection,
//   doc,
//   getDocs,
//   query,
//   setDoc,
//   deleteDoc,
//   getDoc,
// } from 'firebase/firestore'
// import Image from 'next/image'

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'white',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
//   display: 'flex',
//   flexDirection: 'column',
//   gap: 3,
// }

// const fetchInventory = async () => {
//   const snapshot = query(collection(firestore, 'pantry'))
//   const docs = await getDocs(snapshot)
//   const inventoryList = []
//   docs.forEach((doc) => {
//     inventoryList.push({ name: doc.id, ...doc.data() })
//   })
//   return inventoryList
// }

// const addItemToFirestore = async (item) => {
//   const docRef = doc(collection(firestore, 'pantry'), item)
//   const docSnap = await getDoc(docRef)
//   if (docSnap.exists()) {
//     const { quantity } = docSnap.data()
//     await setDoc(docRef, { quantity: quantity + 1 })
//   } else {
//     await setDoc(docRef, { quantity: 1 })
//   }
// }

// const removeItemFromFirestore = async (item) => {
//   const docRef = doc(collection(firestore, 'pantry'), item)
//   const docSnap = await getDoc(docRef)
//   if (docSnap.exists()) {
//     const { quantity } = docSnap.data()
//     if (quantity === 1) {
//       await deleteDoc(docRef)
//     } else {
//       await setDoc(docRef, { quantity: quantity - 1 })
//     }
//   }
// }

// export default function Home() {
//   const [inventory, setInventory] = useState([])
//   const [open, setOpen] = useState(false)
//   const [itemName, setItemName] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [showInventory, setShowInventory] = useState(false)

//   const updateInventory = useCallback(async () => {
//     setLoading(true)
//     try {
//       const inventoryList = await fetchInventory()
//       setInventory(inventoryList)
//     } catch (error) {
//       console.error('Error fetching inventory:', error)
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     if (showInventory) {
//       updateInventory()
//     }
//   }, [showInventory, updateInventory])

//   const handleAddItem = async (item) => {
//     try {
//       await addItemToFirestore(item)
//       await updateInventory()
//     } catch (error) {
//       console.error('Error adding item:', error)
//     }
//   }

//   const handleRemoveItem = async (item) => {
//     try {
//       await removeItemFromFirestore(item)
//       await updateInventory()
//     } catch (error) {
//       console.error('Error removing item:', error)
//     }
//   }

//   const handleOpen = () => setOpen(true)
//   const handleClose = () => setOpen(false)

//   return (
//     <Box
//       width="100vw"
//       height="100vh"
//       display={'flex'}
//       justifyContent={'center'}
//       flexDirection={'column'}
//       alignItems={'center'}
//       gap={2}
//     >
//       {showInventory ? (
//         <>
//           <Modal
//             open={open}
//             onClose={handleClose}
//             aria-labelledby="modal-modal-title"
//             aria-describedby="modal-modal-description"
//           >
//             <Box sx={style}>
//               <Typography id="modal-modal-title" variant="h6" component="h2">
//                 Add Item
//               </Typography>
//               <Stack width="100%" direction={'row'} spacing={2}>
//                 <TextField
//                   id="outlined-basic"
//                   label="Item"
//                   variant="outlined"
//                   fullWidth
//                   value={itemName}
//                   onChange={(e) => setItemName(e.target.value)}
//                 />
//                 <Button
//                   variant="outlined"
//                   onClick={() => {
//                     handleAddItem(itemName)
//                     setItemName('')
//                     handleClose()
//                   }}
//                 >
//                   Add
//                 </Button>
//               </Stack>
//             </Box>
//           </Modal>
//           <Button variant="contained" onClick={handleOpen}>
//             Add New Item
//           </Button>
//           <Box border={'1px solid #333'}>
//             <Box
//               width="800px"
//               height="100px"
//               bgcolor={'#ADD8E6'}
//               display={'flex'}
//               justifyContent={'center'}
//               alignItems={'center'}
//             >
//               <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
//                 Inventory Items
//               </Typography>
//             </Box>
//             {loading ? (
//               <Typography variant={'h5'} color={'#333'} textAlign={'center'}>
//                 Loading...
//               </Typography>
//             ) : (
//               <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
//                 {inventory.map(({ name, quantity }) => (
//                   <Box
//                     key={name}
//                     width="100%"
//                     minHeight="150px"
//                     display={'flex'}
//                     justifyContent={'space-between'}
//                     alignItems={'center'}
//                     bgcolor={'#f0f0f0'}
//                     paddingX={5}
//                   >
//                     <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
//                       {name.charAt(0).toUpperCase() + name.slice(1)}
//                     </Typography>
//                     <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
//                       Quantity: {quantity}
//                     </Typography>
//                     <Button variant="contained" onClick={() => handleRemoveItem(name)}>
//                       Remove
//                     </Button>
//                   </Box>
//                 ))}
//               </Stack>
//             )}
//           </Box>
//         </>
//       ) : (
//         // Initial view showing the pantry door image
//         <>
//           <Box 
//             onClick={() => setShowInventory(true)} 
//             sx={{ 
//               cursor: 'pointer',
//               width: 300, // Initial width
//               transition: 'transform 0.3s, box-shadow 0.3s',
//               '&:hover': {
//                 transform: 'scale(1.05)', // Slightly enlarge on hover
//                 boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', // Add shadow on hover
//               }
//             }}
//           >
//             <Image src="/pantryDoor.jpg" alt="Pantry Door" width={300} height={450} />
//           </Box>
//           <Typography variant="h4" color="#333" textAlign="center" marginTop={2}>
//             Pantry Tracker
//           </Typography>
//         </>
//       )}
//     </Box>
//   )
// }

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore, storage } from '@/firebase' // Import firestore and storage
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Image from 'next/image'
import { Camera } from 'react-camera-pro'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

const fetchInventory = async () => {
  const snapshot = query(collection(firestore, 'pantry'))
  const docs = await getDocs(snapshot)
  const inventoryList = []
  docs.forEach((doc) => {
    inventoryList.push({ name: doc.id, ...doc.data() })
  })
  return inventoryList
}

const addItemToFirestore = async (item, imageUrl) => {
  const docRef = doc(collection(firestore, 'pantry'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const { quantity } = docSnap.data()
    await setDoc(docRef, { imageUrl, quantity: quantity + 1 }, { merge: true })
  } else {
    await setDoc(docRef, { imageUrl, quantity: 1 })
  }
}

const removeItemFromFirestore = async (item) => {
  const docRef = doc(collection(firestore, 'pantry'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const { quantity, imageUrl } = docSnap.data()
    if (quantity === 1) {
      await deleteDoc(docRef)
    } else {
      await setDoc(docRef, { imageUrl, quantity: quantity - 1 }, { merge: true })
    }
  }
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [imageData, setImageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showInventory, setShowInventory] = useState(false)
  const cameraRef = useRef(null)

  const updateInventory = useCallback(async () => {
    setLoading(true)
    try {
      const inventoryList = await fetchInventory()
      setInventory(inventoryList)
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (showInventory) {
      updateInventory()
    }
  }, [showInventory, updateInventory])

  const handleAddItem = async (item, imageData) => {
    try {
      let imageUrl = ''

      if (imageData) {
        // Convert base64 image to blob
        const response = await fetch(imageData)
        const blob = await response.blob()

        // Upload image to Firebase Storage
        const imageName = `${item}-${Date.now()}.jpg`
        const storageRef = ref(storage, `images/${imageName}`)
        await uploadBytes(storageRef, blob)
        imageUrl = await getDownloadURL(storageRef)
      }

      // Add item to Firestore with image URL
      await addItemToFirestore(item, imageUrl)
      await updateInventory()
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const handleRemoveItem = async (item) => {
    try {
      await removeItemFromFirestore(item)
      await updateInventory()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setImageData(null)
  }

  const handleCapture = () => {
    const photo = cameraRef.current.takePhoto()
    setImageData(photo)
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      {showInventory ? (
        <>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Item
              </Typography>
              <Stack width="100%" direction={'column'} spacing={2}>
                <TextField
                  id="outlined-basic"
                  label="Item"
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <Camera ref={cameraRef} />
                <Button onClick={handleCapture}>Capture Photo</Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    handleAddItem(itemName, imageData)
                    setItemName('')
                    setImageData(null)
                    handleClose()
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Box>
          </Modal>
          <Button variant="contained" onClick={handleOpen}>
            Add New Item
          </Button>
          <Box border={'1px solid #333'}>
            <Box
              width="800px"
              height="100px"
              bgcolor={'#ADD8E6'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
                Inventory Items
              </Typography>
            </Box>
            {loading ? (
              <Typography variant={'h5'} color={'#333'} textAlign={'center'}>
                Loading...
              </Typography>
            ) : (
              <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
                {inventory.map(({ name, quantity, imageUrl }) => (
                  <Box
                    key={name}
                    width="100%"
                    minHeight="150px"
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    bgcolor={'#f0f0f0'}
                    paddingX={5}
                    position={'relative'}
                  >
                    <Box width="15%" height="100%" display="flex" alignItems="center" justifyContent="center">
                      {imageUrl && (
                        <Image src={imageUrl} alt={name} width={100} height={100} objectFit="cover" />
                      )}
                    </Box>
                    <Box width="55%" display="flex" flexDirection="column" alignItems="center">
                      <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </Typography>
                      <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                        Quantity: {quantity}
                      </Typography>
                    </Box>
                    <Button variant="contained" onClick={() => handleRemoveItem(name)}>
                      Remove
                    </Button>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </>
      ) : (
        <>
          <Box 
            onClick={() => setShowInventory(true)} 
            sx={{ 
              cursor: 'pointer',
              width: 300, // Initial width
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)', // Slightly enlarge on hover
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', // Add shadow on hover
              }
            }}
          >
            <Image src="/pantryDoor.jpg" alt="Pantry Door" width={300} height={450} />
          </Box>
          <Typography variant="h4" color="#333" textAlign="center" marginTop={2}>
            Pantry Tracker
          </Typography>
        </>
      )}
    </Box>
  )
}
