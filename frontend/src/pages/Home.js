import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Carousel,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const heroImages = [
    "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2071&auto=format&fit=crop",
  ];

  const features = [
    {
      icon: "💰",
      title: "Instant Transfers",
      description: "Send money to anyone, anywhere in seconds with zero fees",
    },
    {
      icon: "🔒",
      title: "Bank-Level Security",
      description: "Your money is protected with advanced encryption and fraud monitoring",
    },
    {
      icon: "📱",
      title: "Mobile Banking",
      description: "Full banking capabilities right from your smartphone",
    },
    {
      icon: "💳",
      title: "Smart Cards",
      description: "Contactless payments with dynamic security codes",
    },
  ];

  const testimonials = [
    {
      text: "Switching to this bank was the best financial decision I've made. The app is incredible!",
      author: "Sarah Johnson",
      rating: 5,
      image: "/images/sarah.jpg",
    },
    {
      text: "I love the instant notifications and the ability to control my card security right from the app.",
      author: "Michael Chen",
      rating: 5,
      image: "/images/michael.jpg",
    },
    {
      text: "The customer service is outstanding and the interest rates are very competitive.",
      author: "David Wilson",
      rating: 5,
      image: "/images/david.jpg",
    },
  ];

  const services = [
    {
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop",
      name: "Savings Accounts",
      description: "High-yield savings with no minimum balance",
    },
    {
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
      name: "Investment Tools",
      description: "Grow your wealth with our smart investment platform",
    },
    {
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1911&auto=format&fit=crop",
      name: "Personal Loans",
      description: "Competitive rates and fast approval",
    },
    {
      image: "https://images.unsplash.com/photo-1601599561213-832382fd07ba?q=80&w=1964&auto=format&fit=crop",
      name: "Mortgage Solutions",
      description: "Tailored home financing options",
    },
  ];

  const stats = [
    { number: "2M+", label: "Happy Customers" },
    { number: "$50B+", label: "Assets Managed" },
    { number: "24/7", label: "Customer Support" },
    { number: "99.9%", label: "Uptime Guarantee" },
  ];

  const chunkedServices = [];
  for (let i = 0; i < services.length; i += 2) {
    chunkedServices.push(services.slice(i, i + 2));
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section with Background Carousel */}
      <div
        style={{ position: "relative", height: "100vh", overflow: "hidden" }}
      >
        <Carousel
          fade
          controls={false}
          indicators={false}
          interval={6000}
          pause={false}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        >
          {heroImages.map((image, index) => (
            <Carousel.Item key={index} style={{ height: "100vh" }}>
              <div
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "100%",
                  width: "100%",
                  filter: "brightness(0.7)",
                }}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(30, 64, 175, 0.7) 0%, rgba(29, 78, 216, 0.7) 100%)",
            zIndex: 1,
          }}
        />

        <Container
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Row className="align-items-center w-100">
            <Col md={7} className="text-center text-md-start">
              <h1
                style={{
                  fontSize: "4rem",
                  fontWeight: "800",
                  color: "white",
                  marginBottom: "1.5rem",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Banking Made Simple
              </h1>
              <p
                style={{
                  fontSize: "1.5rem",
                  color: "rgba(255, 255, 255, 0.95)",
                  marginBottom: "2.5rem",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                Welcome to the future of banking - secure, fast, and designed for you.
              </p>
              <div className="d-flex gap-3">
                <Button
                  variant="light"
                  size="lg"
                  onClick={() => navigate("/register")}
                  style={{
                    borderRadius: "30px",
                    padding: "1rem 2rem",
                    fontWeight: "700",
                    fontSize: "1.2rem",
                    boxShadow: "0 8px 30px rgba(255, 255, 255, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-3px) scale(1.05)";
                    e.target.style.boxShadow =
                      "0 12px 40px rgba(255, 255, 255, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0) scale(1)";
                    e.target.style.boxShadow =
                      "0 8px 30px rgba(255, 255, 255, 0.3)";
                  }}
                >
                  Open Account
                </Button>
                <Button
                  variant="outline-light"
                  size="lg"
                  onClick={() => navigate("/login")}
                  style={{
                    borderRadius: "30px",
                    padding: "1rem 2rem",
                    fontWeight: "700",
                    fontSize: "1.2rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-3px) scale(1.05)";
                    e.target.style.boxShadow =
                      "0 12px 40px rgba(255, 255, 255, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0) scale(1)";
                  }}
                >
                  Sign In
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <section style={{ background: "#f9fafb", padding: "5rem 0" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
              }}
            >
              Why Choose Us
            </h2>
            <p
              style={{
                fontSize: "1.3rem",
                color: "#6b7280",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              We're redefining banking with customer-focused innovation and cutting-edge technology
            </p>
          </div>

          <Row className="g-4">
            {features.map((feature, index) => (
              <Col key={index} md={6} lg={3}>
                <div
                  style={{
                    background: "white",
                    borderRadius: "25px",
                    padding: "2.5rem",
                    height: "100%",
                    textAlign: "center",
                    boxShadow: "0 10px 30px rgba(30, 64, 175, 0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(30, 64, 175, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(30, 64, 175, 0.1)";
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>
                    {feature.icon}
                  </div>
                  <h4
                    style={{
                      fontWeight: "700",
                      color: "#1f2937",
                      marginBottom: "1rem",
                    }}
                  >
                    {feature.title}
                  </h4>
                  <p style={{ color: "#6b7280", fontSize: "1rem", margin: 0 }}>
                    {feature.description}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
          padding: "3rem 0",
        }}
      >
        <Container>
          <Row className="g-4">
            {stats.map((stat, index) => (
              <Col key={index} xs={6} md={3} className="text-center">
                <h3
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    color: "white",
                    marginBottom: "0.5rem",
                  }}
                >
                  {stat.number}
                </h3>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "1.1rem",
                    margin: 0,
                  }}
                >
                  {stat.label}
                </p>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section style={{ padding: "5rem 0", background: "white" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
              }}
            >
              Our Services
            </h2>
            <p style={{ fontSize: "1.3rem", color: "#6b7280" }}>
              Comprehensive financial solutions tailored to your needs
            </p>
          </div>

          <Carousel
            indicators={true}
            controls={true}
            interval={5000}
            pause="hover"
          >
            {chunkedServices.map((chunk, index) => (
              <Carousel.Item key={index}>
                <Row className="g-4 px-3">
                  {chunk.map((service, serviceIndex) => (
                    <Col md={6} key={serviceIndex}>
                      <Card
                        style={{
                          border: "none",
                          borderRadius: "25px",
                          overflow: "hidden",
                          boxShadow: "0 10px 30px rgba(30, 64, 175, 0.15)",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          height: "100%",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(-10px) scale(1.02)";
                          e.currentTarget.style.boxShadow =
                            "0 20px 40px rgba(30, 64, 175, 0.25)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow =
                            "0 10px 30px rgba(30, 64, 175, 0.15)";
                        }}
                        onClick={() => navigate("/services")}
                      >
                        <div
                          style={{
                            position: "relative",
                            overflow: "hidden",
                            height: "280px",
                          }}
                        >
                          <Image
                            src={service.image}
                            alt={service.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                            }}
                          />
                        </div>
                        <Card.Body style={{ padding: "2rem" }}>
                          <h5
                            style={{
                              fontWeight: "700",
                              color: "#1f2937",
                              marginBottom: "1rem",
                              fontSize: "1.5rem",
                            }}
                          >
                            {service.name}
                          </h5>
                          <p
                            style={{
                              color: "#6b7280",
                              margin: 0,
                              fontSize: "1.1rem",
                            }}
                          >
                            {service.description}
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Carousel.Item>
            ))}
          </Carousel>

          <div className="text-center mt-5">
            <Button
              variant="primary"
              onClick={() => navigate("/services")}
              style={{
                background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
                border: "none",
                borderRadius: "30px",
                padding: "1rem 3rem",
                fontWeight: "700",
                fontSize: "1.1rem",
                boxShadow: "0 8px 30px rgba(30, 64, 175, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow =
                  "0 12px 40px rgba(30, 64, 175, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 30px rgba(30, 64, 175, 0.3)";
              }}
            >
              Explore All Services
            </Button>
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section style={{ background: "#f9fafb", padding: "5rem 0" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
              }}
            >
              Customer Stories
            </h2>
            <p style={{ fontSize: "1.3rem", color: "#6b7280" }}>
              Hear from our satisfied customers
            </p>
          </div>
          <Row className="g-4">
            {testimonials.map((item, index) => (
              <Col key={index} lg={4} md={6}>
                <div
                  style={{
                    background: "white",
                    borderRadius: "25px",
                    padding: "2.5rem",
                    height: "100%",
                    boxShadow: "0 10px 30px rgba(30, 64, 175, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(30, 64, 175, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(30, 64, 175, 0.1)";
                  }}
                >
                  <div style={{ display: "flex", marginBottom: "1.5rem" }}>
                    {[...Array(item.rating)].map((_, i) => (
                      <span
                        key={i}
                        style={{
                          color: "#f59e0b",
                          fontSize: "1.5rem",
                          marginRight: "0.25rem",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: "1.1rem",
                      color: "#4b5563",
                      marginBottom: "2rem",
                      flex: 1,
                      fontStyle: "italic",
                    }}
                  >
                    "{item.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        marginRight: "1rem",
                        boxShadow: "0 4px 15px rgba(30, 64, 175, 0.2)",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.author}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${item.author}&background=1e40af&color=fff`;
                        }}
                      />
                    </div>
                    <span style={{ fontWeight: "600", color: "#1f2937" }}>
                      {item.author}
                    </span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
          padding: "5rem 0",
          textAlign: "center",
        }}
      >
        <Container>
          <h2
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              color: "white",
              marginBottom: "1.5rem",
            }}
          >
            Ready to Experience Better Banking?
          </h2>
          <p
            style={{
              fontSize: "1.3rem",
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: "2.5rem",
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
            }}
          >
            Join millions who are already enjoying smarter financial management
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button
              variant="light"
              size="lg"
              onClick={() => navigate("/register")}
              style={{
                borderRadius: "30px",
                padding: "1rem 2rem",
                fontWeight: "700",
                fontSize: "1.2rem",
                boxShadow: "0 8px 30px rgba(255, 255, 255, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px) scale(1.05)";
                e.target.style.boxShadow = "0 12px 40px rgba(255, 255, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 8px 30px rgba(255, 255, 255, 0.3)";
              }}
            >
              Open Account
            </Button>
            <Button
              variant="outline-light"
              size="lg"
              onClick={() => navigate("/login")}
              style={{
                borderRadius: "30px",
                padding: "1rem 2rem",
                fontWeight: "700",
                fontSize: "1.2rem",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px) scale(1.05)";
                e.target.style.boxShadow = "0 12px 40px rgba(255, 255, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
              }}
            >
              Sign In
            </Button>
          </div>
        </Container>
      </section>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }

          .carousel-control-prev-icon,
          .carousel-control-next-icon {
            background-color: rgba(30, 64, 175, 0.8);
            border-radius: 50%;
            padding: 20px;
          }

          .carousel-indicators button {
            background-color: rgba(30, 64, 175, 0.5);
            width: 12px;
            height: 12px;
            border-radius: 50%;
          }

          .carousel-indicators button.active {
            background-color: #1e40af;
            width: 35px;
            border-radius: 20px;
          }

          .carousel-control-prev,
          .carousel-control-next {
            width: 5%;
          }

          .carousel-item {
            transition: transform 0.8s ease-in-out;
          }

          @media (max-width: 768px) {
            h1 { font-size: 2.5rem !important; }
            h2 { font-size: 2rem !important; }
            .carousel-item .col-md-6 { margin-bottom: 1rem; }
          }
        `}
      </style>
    </div>
  );
}

export default Home;