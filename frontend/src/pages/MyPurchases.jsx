import { useState, useEffect } from 'react';
import { Box, Container, SimpleGrid, Heading, Text, Flex, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import CourseCard from '../components/CourseCard';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MyPurchases() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchPurchases();
  }, [token, navigate]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getPurchases();
      setCourses(response.data.coursesData || []);
      setError(null);
    } catch (err) {
      setError('Failed to load your purchased courses. Please try again later.');
      console.error('Error fetching purchases:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="50vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center" mb={10}>
        <Heading as="h1" size="2xl" mb={4} color="blue.600">
          My Courses
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Access your purchased courses
        </Text>
      </Box>

      {courses.length === 0 ? (
        <Box textAlign="center" p={10} bg="gray.50" borderRadius="md">
          <Heading as="h3" size="md" mb={4} color="gray.600">
            You haven't purchased any courses yet
          </Heading>
          <Text color="gray.500">
            Browse our catalog and find courses that match your interests.
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {courses.map((course) => (
            <CourseCard 
              key={course._id} 
              course={course} 
              isPurchased={true}
            />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
} 