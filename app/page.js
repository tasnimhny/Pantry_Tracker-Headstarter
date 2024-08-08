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
import GitHubIcon from '@mui/icons-material/GitHub' // Ensure this package is installed

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
      display="flex"
      flexDirection="column"
      bgcolor="#ffe4e1" // Light pink background
    >
      {/* Top Bar */}
      <Box
        width="100%"
        height="2cm"
        bgcolor="#b57edc" // Lavender background
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        paddingRight={2}
      >
        <a href="https://github.com/tasnimhny" target="_blank" rel="noopener noreferrer">
          <GitHubIcon style={{ color: 'white', fontSize: '2rem' }} />
        </a>
      </Box>
      {/* Main Content */}
      <Box
        width="100%"
        display="flex"
        flex="1"
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="30%"
          bgcolor="#ffe4e1" // Light pink background
          padding={2}
        >
          <Box
            sx={{
              cursor: 'pointer',
              width: 200, // Smaller width for the pantry door
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
              }
            }}
            onClick={() => setShowInventory(true)}
          >
            <Image src="/pantryDoor.jpg" alt="Pantry Door" width={200} height={300} />
          </Box>
          <Typography variant="h4" color="#b57edc" textAlign="center" marginTop={2} fontFamily="cursive">
            Pantry Tracker
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="70%"
          padding={2}
        >
          {!showInventory && (
            <>
              <Typography variant="h3" color="#b57edc" textAlign="center" fontFamily="cursive">
                Welcome to Your Pantry Tracker!
              </Typography>
              <Typography variant="body1" color="#b57edc" textAlign="center" fontFamily="cursive" marginTop={2}>
                Use this app to keep track of the items in your pantry. Capture a photo of each item and add it to your inventory. 
                You can view, add, and remove items easily. Click on the pantry door to start managing your inventory.
              </Typography>
            </>
          )}
          {showInventory && (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              marginTop={4}
              width="100%"
            >
              <Button variant="contained" onClick={handleOpen}>
                Add New Item
              </Button>
              <Box border="1px solid #333" marginTop={2} width="100%">
                <Box
                  width="100%"
                  height="100px"
                  bgcolor="#add8e6"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography variant="h2" color="#b57edc" textAlign="center" fontFamily="cursive">
                    Inventory Items
                  </Typography>
                </Box>
                {loading ? (
                  <Typography variant="h5" color="#b57edc" textAlign="center" fontFamily="cursive">
                    Loading...
                  </Typography>
                ) : (
                  <Stack width="100%" spacing={2} overflow="auto">
                    {inventory.map(({ name, quantity, imageUrl }) => (
                      <Box
                        key={name}
                        width="100%"
                        minHeight="150px"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        bgcolor="#f0f0f0"
                        paddingX={5}
                        position="relative"
                      >
                        <Box width="15%" height="100%" display="flex" alignItems="center" justifyContent="center">
                          {imageUrl && (
                            <Image src={imageUrl} alt={name} width={100} height={100} objectFit="cover" />
                          )}
                        </Box>
                        <Box width="55%" display="flex" flexDirection="column" alignItems="center">
                          <Typography variant="h3" color="#b57edc" textAlign="center" fontFamily="cursive">
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                          </Typography>
                          <Typography variant="h3" color="#b57edc" textAlign="center" fontFamily="cursive">
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
            </Box>
          )}
        </Box>
      </Box>
      {/* Add Item Modal */}
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
          <Stack width="100%" direction="column" spacing={2}>
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
    </Box>
  )
}

