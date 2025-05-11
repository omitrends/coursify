import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  Container,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

export default function AddCourse() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Redirect if not admin
  useEffect(() => {
    if (!token || !isAdmin) {
      navigate('/login');
    }
  }, [token, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handlePriceChange = (value) => {
    setFormData({
      ...formData,
      price: value,
    });
    
    if (errors.price) {
      setErrors({
        ...errors,
        price: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL starting with http:// or https://';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsLoading(true);
    
    const courseData = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      imageUrl: formData.imageUrl,
    };

    try {
      await adminAPI.createCourse(courseData);
      toast({
        title: 'Course created',
        description: 'Your course has been created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Failed to create course',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="lg" py={{ base: 12, md: 24 }}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} color="blue.600">Add New Course</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            Create a new course for your students
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={'white'}
          boxShadow={'lg'}
          p={8}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="title" isRequired isInvalid={!!errors.title}>
                <FormLabel>Course Title</FormLabel>
                <Input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.title}</FormErrorMessage>
              </FormControl>
              
              <FormControl id="description" isRequired isInvalid={!!errors.description}>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
              </FormControl>
              
              <FormControl id="price" isRequired isInvalid={!!errors.price}>
                <FormLabel>Price ($)</FormLabel>
                <NumberInput 
                  min={0} 
                  precision={2} 
                  value={formData.price}
                  onChange={handlePriceChange}
                >
                  <NumberInputField name="price" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.price}</FormErrorMessage>
              </FormControl>
              
              <FormControl id="imageUrl" isRequired isInvalid={!!errors.imageUrl}>
                <FormLabel>Image URL</FormLabel>
                <Input 
                  type="text" 
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
                <FormErrorMessage>{errors.imageUrl}</FormErrorMessage>
              </FormControl>
              
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  type="submit"
                  isLoading={isLoading}
                >
                  Create Course
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
} 