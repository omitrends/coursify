import { useState, useEffect } from 'react';
import { Box, Container, SimpleGrid, Heading, Text, Flex, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription, Button } from '@chakra-ui/react';
import CourseCard from '../components/CourseCard';
import { courseAPI } from '../services/api';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log('Fetching courses...');
      const response = await courseAPI.getAllCourses();
      console.log('Courses response:', response);
      
      if (response.data && response.data.courses) {
        setCourses(response.data.courses);
        setError(null);
      } else {
        console.error('Invalid response format:', response);
        setError('Received invalid data format from server');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(`Failed to load courses: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleRetry = () => {
    fetchCourses();
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
        <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px" borderRadius="md">
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Error Loading Courses
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {error}
          </AlertDescription>
          <Button onClick={handleRetry} colorScheme="red" variant="outline" mt={4}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center" mb={10}>
        <Heading as="h1" size="2xl" mb={4} color="blue.600">
          Explore Our Courses
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Discover high-quality courses to enhance your skills
        </Text>
      </Box>

      {courses.length === 0 ? (
        <Text textAlign="center" fontSize="lg" color="gray.500">
          No courses available at the moment. Please check back later.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {courses.map((course) => (
            <CourseCard 
              key={course._id} 
              course={course} 
              onPurchase={fetchCourses}
            />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
} 