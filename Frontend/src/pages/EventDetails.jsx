import {useEffect, useMemo, useState} from "react";

import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  HiCalendar, 
  HiLocationMarker, 
  HiUserGroup, 
  HiClock,
  HiShare,
  HiBookmark,
  HiCheckCircle,
  HiOutlineBookmark
} from 'react-icons/hi'

import { FaHandsHelping } from 'react-icons/fa'
import { format } from 'date-fns'

import toast from "react-hot-toast";
import VolunteerList from "../components/VolunteerList";
import { fetchEventById, volunteerForEvent } from "../service/event.service";
import { useAuth } from "../auth/AuthContext";



const fallbackImage = "https://via.placeholder.com/1200x500?text=Event+Image";
const fallbackLogo = "https://via.placeholder.com/100?text=NGO";









const EventDetails = () => {
  const { id } = useParams();
  const[event,setEvent]=useState(null)
  const[loading,setLoading]=useState(null)
  const [isSaved, setIsSaved] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState('')
  const{ isAuthenticated,userType}=useAuth()


  useEffect(()=>{
    const loadEvent=async()=>{
      try{
        setLoading(true);
        const data=await fetchEventById(id);

        setEvent(data);

      }catch(err){
        toast.error(err.response?.data?.message || "Failed to load event");
      }
    finally{
      setLoading(false);
    }
  };  if(id)loadEvent(); },[id]);
  



  // // Sample event data (in real app, fetch based on id)
  // const eventData = {
  //   '1': {
  //     _id: '1',
  //     title: 'Beach Cleanup Drive',
  //     description: 'Join us in cleaning the local beach and protecting marine life. We need enthusiastic volunteers to help collect waste and sort recyclables. This event is part of our monthly initiative to keep our beaches clean and raise awareness about marine pollution.',
  //     longDescription: `
  //       <p>Join Ocean Conservation Society for our monthly beach cleanup event at Juhu Beach, Mumbai. This is a great opportunity to make a tangible difference in protecting our marine environment while meeting like-minded individuals passionate about conservation.</p>
        
  //       <h4>What to expect:</h4>
  //       <ul>
  //         <li>Cleanup equipment (gloves, bags, pickers) will be provided</li>
  //         <li>Brief orientation on safety and waste sorting</li>
  //         <li>2-hour cleanup session</li>
  //         <li>Refreshments and snacks provided</li>
  //         <li>Certificate of participation for volunteers</li>
  //       </ul>
        
  //       <h4>Impact:</h4>
  //       <p>Last month, our volunteers collected over 500 lbs of waste from this beach, preventing it from entering the ocean and harming marine life. Your participation directly contributes to cleaner beaches and healthier oceans.</p>
  //     `,
  //     date: '2024-04-15',
  //     time: '09:00 AM - 12:00 PM',
  //     category: 'Environment',
  //     organization: {
  //       name: 'Ocean Conservation Society',
  //       logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  //       rating: 4.8,
  //       eventsCount: 45,
  //       joinedDate: '2019',
  //     },
  //     skillsRequired: ['Teamwork', 'Physical Fitness', 'Environmental Awareness', 'Waste Sorting'],
  //     volunteers: [
  //       { id: 1, name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108777-296fd5c7c9b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  //       { id: 2, name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  //       { id: 3, name: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  //     ],
  //     maxVolunteers: 50,
  //     currentVolunteers: 32,
  //     location: {
  //       address: 'Juhu Beach, Mumbai, Maharashtra 400049',
  //       coordinates: { lat: 19.1075, lng: 72.8261 },
  //     },
  //     requirements: [
  //       'Must be at least 18 years old',
  //       'Comfortable working outdoors',
  //       'Able to lift up to 20 lbs',
  //       'Wear closed-toe shoes and comfortable clothing',
  //     ],
  //     benefits: [
  //       'Certificate of participation',
  //       'Community service hours',
  //       'Free refreshments',
  //       'Networking with environmental enthusiasts',
  //     ],
  //     images: [
  //       'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  //     ],
  //   },
  //   '2': {
  //     _id: '2',
  //     title: 'Teaching Workshop',
  //     description: 'Help underprivileged children with their studies in mathematics and science.',
  //     longDescription: `
  //       <p>Join Education First Foundation for our teaching workshop in Dharavi, Mumbai. This is a wonderful opportunity to help shape young minds and make a lasting impact on children's education.</p>
        
  //       <h4>What to expect:</h4>
  //       <ul>
  //         <li>Teaching materials and curriculum provided</li>
  //         <li>Training session on effective teaching methods</li>
  //         <li>3-hour teaching session with small groups</li>
  //         <li>Interaction with local teachers and community</li>
  //         <li>Certificate of appreciation for volunteers</li>
  //       </ul>
        
  //       <h4>Impact:</h4>
  //       <p>Last month, our volunteers helped over 50 children improve their math and science scores. Your participation directly contributes to better educational outcomes for underprivileged students.</p>
  //     `,
  //     date: '2024-04-20',
  //     time: '02:00 PM - 05:00 PM',
  //     category: 'Education',
  //     organization: {
  //       name: 'Education First Foundation',
  //       logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  //       rating: 4.9,
  //       eventsCount: 32,
  //       joinedDate: '2018',
  //     },
  //     skillsRequired: ['Teaching', 'Patience', 'Communication'],
  //     volunteers: [
  //       { id: 1, name: 'Arjun Kumar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  //       { id: 2, name: 'Neha Shah', avatar: 'https://images.unsplash.com/photo-1494790108777-296fd5c7c9b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  //     ],
  //     maxVolunteers: 20,
  //     currentVolunteers: 18,
  //     location: {
  //       address: 'Dharavi Community Center, Mumbai, Maharashtra 400017',
  //       coordinates: { lat: 19.0370, lng: 72.8495 },
  //     },
  //     requirements: [
  //       'Must be at least 16 years old',
  //       'Basic teaching or tutoring experience preferred',
  //       'Comfortable working with children',
  //       'Fluent in English and Hindi',
  //     ],
  //     benefits: [
  //       'Teaching experience certificate',
  //       'Community service hours',
  //       'Professional development',
  //       'Networking with educators',
  //     ],
  //     images: [
  //       'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  //     ],
  //   },
  //   '3': {
  //     _id: '3',
  //     title: 'Health Camp',
  //     description: 'Medical camp for rural communities providing basic health checkups and medicines.',
  //     longDescription: `
  //       <p>Join Health for All Foundation for our medical health camp in Bandra West, Mumbai. This is an opportunity to provide essential healthcare services to underserved communities.</p>
        
  //       <h4>What to expect:</h4>
  //       <ul>
  //         <li>Medical equipment and supplies provided</li>
  //         <li>Supervision by experienced medical professionals</li>
  //         <li>4-hour health camp service</li>
  //         <li>Basic medical training for volunteers</li>
  //         <li>Certificate of medical service</li>
  //       </ul>
        
  //       <h4>Impact:</h4>
  //       <p>Last month, our health camp served over 200 patients with free checkups and medicines. Your participation directly contributes to better healthcare access for marginalized communities.</p>
  //     `,
  //     date: '2024-04-25',
  //     time: '10:00 AM - 02:00 PM',
  //     category: 'Healthcare',
  //     organization: {
  //       name: 'Health for All Foundation',
  //       logo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  //       rating: 4.7,
  //       eventsCount: 28,
  //       joinedDate: '2020',
  //     },
  //     skillsRequired: ['Medical Knowledge', 'First Aid', 'Empathy'],
  //     volunteers: [
  //       { id: 1, name: 'Dr. Raj Patel', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  //     ],
  //     maxVolunteers: 30,
  //     currentVolunteers: 25,
  //     location: {
  //       address: 'Bandra West Health Center, Mumbai, Maharashtra 400050',
  //       coordinates: { lat: 19.0596, lng: 72.8295 },
  //     },
  //     requirements: [
  //       'Medical background preferred (students welcome)',
  //       'Basic first aid knowledge',
  //       'Comfortable working with patients',
  //       'Professional demeanor',
  //     ],
  //     benefits: [
  //       'Medical service certificate',
  //       'Clinical experience',
  //       'Professional networking',
  //       'Community health training',
  //     ],
  //     images: [
  //       'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  //     ],
  //   },
  // }

  

  // // Similar events
  // const similarEvents = [
  //   {
  //     _id: '2',
  //     title: 'Teaching Workshop',
  //     description: 'Help underprivileged children with their studies.',
  //     date: '2024-04-20',
  //     category: 'Education',
  //     skillsRequired: ['Teaching', 'Patience'],
  //     volunteers: [1, 2],
  //     maxVolunteers: 20,
  //     image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  //   },
  //   {
  //     _id: '3',
  //     title: 'Health Camp',
  //     description: 'Medical camp for rural communities.',
  //     date: '2024-04-25',
  //     category: 'Healthcare',
  //     skillsRequired: ['Medical Knowledge', 'First Aid'],
  //     volunteers: [1],
  //     maxVolunteers: 30,
  //     image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  //   },
  // ]
  const ngo = event?.ngoId || {};
  const volunteers = event?.volunteers || [];
  const currentVolunteers = volunteers.length;
  const maxVolunteers = Number(event?.maxVolunteers || 0);
  const spotsLeft = Math.max(maxVolunteers - currentVolunteers, 0);

  const eventDateText = useMemo(() => {
    if (!event?.date) return "N/A";
    try {
      return format(new Date(event.date), "MMM dd, yyyy");
    } catch {
      return "N/A";
    }
  }, [event?.date]);



 const handleApply=async(e)=>{
    e.preventDefault()
    if(!isAuthenticated){
      toast.error('please login first')
      return
    }
    if(userType!=='volunteer'){
      toast.error('Only volunteers can apply for events')
      return
    }

    try{
      setIsApplying(true)
      await volunteerForEvent(id)
      toast.sucess("Apply successfully")
      const refreshed=await fetchEventById(id)
      setEvent(refreshed.data);
      setApplicationMessage("");
      setShowApplicationForm(false);
    }catch(err){
      toast.error(err.response?.data?.message || 'Application failed')
  } finally {
    setIsApplying(false);
  }
};


if (loading) {
  return <div className="min-h-screen pt-24 text-center text-earth-600">Loading event...</div>;
}
if (!event) {
  return <div className="min-h-screen pt-24 text-center text-earth-600">Event not found.</div>;


 

  return (
    <div className="min-h-screen bg-earth-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-96 object-cover rounded-2xl"
          />
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-3">
                    {event.category}
                  </span>
                  <h1 className="text-3xl font-display font-bold text-earth-900">
                    {event.title}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className="p-3 border border-earth-200 rounded-lg hover:bg-earth-50 transition-colors"
                  >
                    {isSaved ? (
                      <HiBookmark className="w-5 h-5 text-primary-600" />
                    ) : (
                      <HiOutlineBookmark className="w-5 h-5 text-earth-600" />
                    )}
                  </button>
                  <button className="p-3 border border-earth-200 rounded-lg hover:bg-earth-50 transition-colors">
                    <HiShare className="w-5 h-5 text-earth-600" />
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-earth-200">
                <div>
                  <div className="flex items-center text-earth-600 mb-1">
                    <HiCalendar className="w-4 h-4 mr-1" />
                    <span className="text-xs">Date</span>
                  </div>
                  <div className="font-medium text-earth-900">
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-earth-600 mb-1">
                    <HiClock className="w-4 h-4 mr-1" />
                    <span className="text-xs">Time</span>
                  </div>
                  <div className="font-medium text-earth-900">{event.time}</div>
                </div>
                <div>
                  <div className="flex items-center text-earth-600 mb-1">
                    <HiLocationMarker className="w-4 h-4 mr-1" />
                    <span className="text-xs">Location</span>
                  </div>
                  <div className="font-medium text-earth-900">
                    {event.location.address.split(',')[0]}
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-earth-600 mb-1">
                    <HiUserGroup className="w-4 h-4 mr-1" />
                    <span className="text-xs">Spots Left</span>
                  </div>
                  <div className="font-medium text-earth-900">
                    {event.maxVolunteers - event.currentVolunteers} / {event.maxVolunteers}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-display font-semibold text-earth-900 mb-4">
                About This Event
              </h2>
              <div 
                className="prose max-w-none text-earth-600"
                dangerouslySetInnerHTML={{ __html: event.longDescription }}
              />
            </motion.div>

            {/* Skills Required */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-display font-semibold text-earth-900 mb-4">
                Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {event.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-earth-100 text-earth-700 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Requirements & Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-earth-900 mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {event.requirements.map((req, index) => (
                    <li key={index} className="flex items-start text-earth-600">
                      <HiCheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-earth-900 mb-4">Benefits</h3>
                <ul className="space-y-2">
                  {event.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-earth-600">
                      <HiCheckCircle className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Registered Volunteers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <VolunteerList volunteers={event.volunteers} maxVolunteers={event.maxVolunteers} />
            </motion.div>

            </div>

          {/* Right Column - Apply & Organization Info */}
          <div className="space-y-6">
            {/* Apply Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-earth-900 mb-1">
                  {event.maxVolunteers - event.currentVolunteers}
                </div>
                <div className="text-earth-600">spots remaining</div>
              </div>

              {!showApplicationForm ? (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 mb-4"
                >
                  Apply as Volunteer
                </button>
              ) : (
                <form onSubmit={handleApply} className="space-y-4 mb-4">
                  <textarea
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    placeholder="Tell us why you'd like to volunteer for this event..."
                    rows="4"
                    className="w-full px-4 py-3 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="px-4 py-3 border border-earth-200 rounded-lg hover:bg-earth-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <p className="text-xs text-center text-earth-500">
                By applying, you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>

            {/* Organization Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={event.organization.logo}
                  alt={event.organization.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-display font-semibold text-earth-900">
                    {event.organization.name}
                  </h3>
                  <div className="flex items-center text-sm text-earth-600 mt-1">
                    <span>⭐ {event.organization.rating}</span>
                    <span className="mx-2">•</span>
                    <span>{event.organization.eventsCount}+ events</span>
                  </div>
                </div>
              </div>
              <button className="w-full px-4 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                View Organization Profile
              </button>
            </motion.div>

                      </div>
        </div>

      </div>
    </div>
  )
}
}
export default EventDetails;
