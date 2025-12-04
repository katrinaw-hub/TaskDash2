import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import auth from "../lib/auth-helper.js";
import { listTasks } from "../lib/api-task.js";
import mobileImage from "../core/assets/image_1.jpg";
import checklistImage from "../core/assets/image_2.jpg";

export default function Home() {
  const jwt = auth.isAuthenticated();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const currentJwt = auth.isAuthenticated();
      if (!currentJwt) return;

      const abortController = new AbortController();
      const signal = abortController.signal;

      listTasks(currentJwt, signal).then((data) => {
        if (data?.aborted) return;

        if (data?.error) {
          setError(data.error);
          setTasks([]);
        } else if (Array.isArray(data)) {
          setError("");
          setTasks(data.slice(0, 5));
        }
      });

      return () => abortController.abort();
    } catch (e) {
      setError("Failed to load tasks.");
    }
  }, []);

  return (
    <Box sx={{ backgroundColor: "#121212", minHeight: "100vh", color: "#fff" }}>
      {/* Hero Section */}
      <Box
        sx={{
          py: 10,
          background: "linear-gradient(135deg, #008080 0%, #004d4d 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 4,
              alignItems: "flex-start",
              flexWrap: "nowrap",
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h1" fontWeight={800} color="#FF9800" gutterBottom>
                TaskDash
              </Typography>
              <Typography variant="h4" color="rgba(255,255,255,0.95)" gutterBottom>
                Smart Warehouse Management
              </Typography>
              <Typography variant="h6" color="rgba(255,255,255,0.75)" gutterBottom>
                Schedule tasks, manage employees, and keep operations running smoothly.
              </Typography>

              <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
                {!jwt && (
                  <>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#FF9800", color: "#121212" }}
                      component={Link}
                      to="/signup"
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ borderColor: "#FF9800", color: "#FF9800" }}
                      component={Link}
                      to="/signin"
                    >
                      I already have an account
                    </Button>
                  </>
                )}
                {jwt && (
                  <>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#FF9800", color: "#121212" }}
                      component={Link}
                      to="/tasks"
                    >
                      View All Tasks
                    </Button>
                    {(jwt.user.role === "admin" || jwt.user.role === "manager") && (
                      <Button
                        variant="outlined"
                        sx={{ borderColor: "#FF9800", color: "#FF9800" }}
                        component={Link}
                        to="/tasks/new"
                      >
                        Create Task
                      </Button>
                    )}
                  </>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                flex: "0 0 auto",
                width: 380,     
                height: 380,    
              }}
            >
              <img
                src={mobileImage}
                alt="User interacting with TaskDash"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 16,
                  boxShadow: "0 0 12px rgba(0,0,0,0.5)",
                  display: "block",
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Upcoming Tasks Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          {/* Row: image left, tasks right */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 4,
              alignItems: "flex-start",
              flexWrap: "nowrap",
            }}
          >
            
            <Box
              sx={{
                flex: "0 0 auto",
                width: 150,    
                height: 200,   
              }}
            >
              <img
                src={checklistImage}
                alt="Checklist with red checkmark"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 16,
                  boxShadow: "0 0 12px rgba(0,0,0,0.5)",
                  display: "block",
                }}
              />
            </Box>

            {/* Right: Tasks list */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
              >
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Upcoming Tasks
                </Typography>

                {!jwt && (
                  <Typography color="rgba(255,255,255,0.75)">
                    Sign in to see tasks assigned to you or your team.
                  </Typography>
                )}

                {jwt && error && <Typography color="error">{error}</Typography>}

                {jwt && !error && tasks.length === 0 && (
                  <Typography color="rgba(255,255,255,0.75)">
                    No tasks yet. Create one to get started.
                  </Typography>
                )}

                {jwt &&
                  tasks.map((task) => (
                    <Box
                      key={task._id}
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 3,
                        bgcolor: "rgba(255,255,255,0.15)",
                        boxShadow: 1,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {task.taskId} – {task.name}
                      </Typography>
                      <Typography variant="body2" color="rgba(255,255,255,0.75)">
                        {task.location} · {new Date(task.scheduledAt).toLocaleString()}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          size="small"
                          label={task.status}
                          sx={{
                            backgroundColor:
                              task.status === "completed"
                                ? "#4caf50"
                                : task.status === "in-progress"
                                ? "#008080"
                                : task.status === "cancelled"
                                ? "#f44336"
                                : "#757575",
                            color: "#fff",
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

{/* What TaskDash Provides Section */}
      <Box sx={{ py: 8, backgroundColor: "#1e1e1e" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={700}
            color="#FF9800"
            align="center"
            gutterBottom
          >
            What TaskDash Provides
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 2 }}>
            {[
              { title: "Smart Scheduling", desc: "Automated task assignments to optimize workflow." },
              { title: "Employee Management", desc: "Track performance and manage roles with ease." },
              { title: "Real-time Updates", desc: "Stay informed with live task status and notifications." },
            ].map((feature, i) => (
              <Paper
                key={i}
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  flex: "1 1 280px",
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.75)">
                  {feature.desc}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 4,
          backgroundColor: "#008080",
          textAlign: "center",
          mt: "auto",
        }}
      >
        <Typography variant="body2" color="#fff">
          © {new Date().getFullYear()} TaskDash. All rights reserved.
        </Typography>
        <Box sx={{ mt: 1, display: "flex", justifyContent: "center", gap: 3 }}>
          <Button component={Link} to="/about" sx={{ color: "#fff", textTransform: "none" }}>
            About
          </Button>
          <Button component={Link} to="/contact" sx={{ color: "#fff", textTransform: "none" }}>
            Contact
          </Button>
          <Button component={Link} to="/privacy" sx={{ color: "#fff", textTransform: "none" }}>
            Privacy
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
