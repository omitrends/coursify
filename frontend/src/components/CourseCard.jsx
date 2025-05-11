import { useState } from 'react';
import { Box, Image, Badge, Text, Stack, Button, useToast } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { courseAPI, userAPI } from '../services/api';

export default function CourseCard({ course, isPurchased = false, onPurchase, isAdminView = false, onEdit }) {
  const { token, isAdmin } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    if (!token) {
      toast({
        title: 'Not logged in',
        description: 'Please login to purchase this course',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (isAdmin) {
      toast({
        title: 'Admin cannot purchase',
        description: 'Admin accounts cannot purchase courses',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log('Attempting to purchase course:', course._id);
      await userAPI.purchaseCourse(course._id);
      toast({
        title: 'Purchase successful',
        description: 'You have successfully purchased this course',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      if (onPurchase) onPurchase();
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: 'Purchase failed',
        description: error.response?.data?.message || 'Failed to purchase course',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="transform 0.3s"
      _hover={{ transform: 'scale(1.02)' }}
    >
      <Image
        src={course.imageUrl || 'https://via.placeholder.com/300x200?text=Course+Image'}
        alt={course.title}
        height="200px"
        width="100%"
        objectFit="cover"
      />

      <Box p="6">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="blue">
            {isPurchased ? 'Enrolled' : `rs:${course.price}`}
          </Badge>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          noOfLines={1}
        >
          {course.title}
        </Box>

        <Text mt={2} color="gray.600" fontSize="sm" noOfLines={3}>
          {course.description}
        </Text>

        <Stack mt={4} direction="row" spacing={4} align="center">
          {isAdminView ? (
            <Button
              colorScheme="teal"
              variant="outline"
              size="sm"
              onClick={() => onEdit(course)}
              width="full"
            >
              Edit Course
            </Button>
          ) : isPurchased ? (
            <Button
              colorScheme="green"
              variant="outline"
              size="sm"
              width="full"
              isDisabled
            >
              Already Purchased
            </Button>
          ) : (
            <Button
              colorScheme="blue"
              size="sm"
              width="full"
              onClick={handlePurchase}
              isLoading={isLoading}
              loadingText="Purchasing"
            >
              Purchase
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
} 