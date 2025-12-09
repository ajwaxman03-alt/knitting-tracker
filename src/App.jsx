import React, { useState, useEffect } from 'react';
import { Heart, Plus, Clock, ChevronRight, Trash2, Play, Pause, CheckCircle, Home, BookOpen, Upload, FileText } from 'lucide-react';

const CounterIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M 4 8 L 6 12 L 8 8" />
    <path d="M 8 8 L 10 12 L 12 8" />
    <path d="M 12 8 L 14 12 L 16 8" />
    <path d="M 16 8 L 18 12 L 20 8" />
    <path d="M 4 14 L 6 18 L 8 14" />
    <path d="M 8 14 L 10 18 L 12 14" />
    <path d="M 12 14 L 14 18 L 16 14" />
    <path d="M 16 14 L 18 18 L 20 14" />
  </svg>
);

const PixelCat = () => (
  <div className="fixed top-4 left-4 z-50" style={{imageRendering: 'pixelated'}}>
    <style>{`
      @keyframes tailWag {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-10deg); }
        75% { transform: rotate(10deg); }
      }
      @keyframes earTwitch {
        0%, 90%, 100% { transform: translateY(0); }
        95% { transform: translateY(-2px); }
      }
      .cat-tail {
        animation: tailWag 2s ease-in-out infinite;
        transform-origin: left center;
      }
      .cat-ear {
        animation: earTwitch 3s ease-in-out infinite;
      }
    `}</style>
    <svg width="40" height="40" viewBox="0 0 32 32">
      <g className="cat-tail">
        <rect x="2" y="20" width="4" height="4" fill="#dc2626"/>
        <rect x="2" y="16" width="4" height="4" fill="#dc2626"/>
        <rect x="6" y="16" width="4" height="4" fill="#dc2626"/>
      </g>
      <rect x="10" y="16" width="12" height="8" fill="#dc2626"/>
      <rect x="10" y="24" width="4" height="4" fill="#dc2626"/>
      <rect x="18" y="24" width="4" height="4" fill="#dc2626"/>
      <rect x="14" y="8" width="12" height="8" fill="#dc2626"/>
      <g className="cat-ear">
        <rect x="14" y="4" width="4" height="4" fill="#dc2626"/>
        <rect x="22" y="4" width="4" height="4" fill="#dc2626"/>
      </g>
      <rect x="18" y="10" width="2" height="2" fill="#fef3c7"/>
      <rect x="22" y="10" width="2" height="2" fill="#fef3c7"/>
      <rect x="20" y="13" width="2" height="1" fill="#fef3c7"/>
    </svg>
  </div>
);

const StitchBorder = () => (
  <div className="fixed inset-0 pointer-events-none z-50">
    <div className="absolute inset-0 border-8" style={{
      borderImage: 'repeating-linear-gradient(90deg, #dc2626 0px, #dc2626 12px, transparent 12px, transparent 20px, #dc2626 20px, #dc2626 32px) 8',
      borderStyle: 'solid'
    }}></div>
    <div className="absolute top-2 left-2 right-2 bottom-2 border-4" style={{
      borderImage: 'repeating-linear-gradient(90deg, #dc2626 0px, #dc2626 8px, transparent 8px, transparent 14px, #dc2626 14px, #dc2626 22px) 4',
      borderStyle: 'dashed',
      borderColor: '#dc2626'
    }}></div>
  </div>
);

const KnittingTracker = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [projects, setProjects] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewPattern, setShowNewPattern] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [zenQuote, setZenQuote] = useState('');

  const zenQuotes = [
    "Each stitch is a moment of peace.",
    "In the rhythm of needles, find your calm.",
    "Create slowly, with intention and love.",
    "The journey of a thousand rows begins with a single stitch.",
    "Let your hands be guided by patience.",
    "Every project tells a story, one row at a time.",
    "Find joy in the simple act of creating.",
    "Knitting is meditation in motion.",
    "With each loop, release what no longer serves you.",
    "The yarn knows where it wants to go."
  ];

  useEffect(() => {
    const storedProjects = localStorage.getItem('knitting-projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
    const storedPatterns = localStorage.getItem('knitting-patterns');
    if (storedPatterns) {
      setPatterns(JSON.parse(storedPatterns));
    }
    setZenQuote(zenQuotes[Math.floor(Math.random() * zenQuotes.length)]);
  }, []);

  useEffect(() => {
    localStorage.setItem('knitting-projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('knitting-patterns', JSON.stringify(patterns));
  }, [patterns]);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 22 || hour < 6) {
        setGreeting('Up late knitting again Emma?');
      } else if (hour < 12) {
        setGreeting('Good Morning Emma');
      } else if (hour < 18) {
        setGreeting('Good Afternoon Emma');
      } else {
        setGreeting('Good Evening Emma');
      }
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const addProject = (project) => {
    const newProject = {
      id: Date.now(),
      ...project,
      currentRow: 0,
      currentStitch: 0,
      totalTime: 0,
      startTime: null,
      notes: [],
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    setProjects([...projects, newProject]);
    setShowNewProject(false);
  };

  const updateProject = (id, updates) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
  };

  const addPattern = (pattern) => {
    const newPattern = {
      id: Date.now(),
      ...pattern,
      createdAt: new Date().toISOString()
    };
    setPatterns([...patterns, newPattern]);
    setShowNewPattern(false);
  };

  const deletePattern = (id) => {
    setPatterns(patterns.filter(p => p.id !== id));
  };

  const toggleTimer = (project) => {
    if (project.startTime) {
      const elapsed = Date.now() - project.startTime;
      updateProject(project.id, {
        totalTime: project.totalTime + elapsed,
        startTime: null
      });
    } else {
      updateProject(project.id, { startTime: Date.now() });
    }
  };

  const addNote = (projectId, note) => {
    const project = projects.find(p => p.id === projectId);
    updateProject(projectId, {
      notes: [...project.notes, { id: Date.now(), text: note, row: project.currentRow }]
    });
  };

  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const handleLetsKnit = () => {
    setShowSplash(false);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2500);
  };

  if (showSplash) {
    return <SplashScreen onStart={handleLetsKnit} />;
  }

  if (showMessage) {
    return <MessageScreen />;
  }

  if (showNewProject) {
    return <NewProjectForm onAdd={addProject} onCancel={() => setShowNewProject(false)} />;
  }

  if (showNewPattern) {
    return <NewPatternForm onAdd={addPattern} onCancel={() => setShowNewPattern(false)} />;
  }

  const selectedProject = selectedProjectId ? projects.find(p => p.id === selectedProjectId) : null;

  if (selectedProject) {
    return <ProjectView 
      project={selectedProject} 
      onBack={() => { setSelectedProjectId(null); setCurrentTab('counting'); }}
      onUpdate={(updates) => updateProject(selectedProject.id, updates)}
      onToggleTimer={() => toggleTimer(selectedProject)}
      onAddNote={(note) => addNote(selectedProject.id, note)}
      formatTime={formatTime}
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-stone-50 pb-20" style={{fontFamily: 'Times New Roman, serif'}}>
      <StitchBorder />
      <PixelCat />
      {currentTab === 'home' && (
        <HomePage greeting={greeting} zenQuote={zenQuote} onNavigate={setCurrentTab} />
      )}
      
      {currentTab === 'counting' && (
        <CountingPage 
          projects={projects}
          onSelectProject={(project) => setSelectedProjectId(project.id)}
          onNewProject={() => setShowNewProject(true)}
          onDeleteProject={deleteProject}
          formatTime={formatTime}
        />
      )}

      {currentTab === 'library' && (
        <LibraryPage
          patterns={patterns}
          onNewPattern={() => setShowNewPattern(true)}
          onDeletePattern={deletePattern}
        />
      )}

      <TabBar currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

const SplashScreen = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-amber-50 to-red-50 flex flex-col items-center justify-center px-6" style={{fontFamily: 'Times New Roman, serif'}}>
      <StitchBorder />
      <PixelCat />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drop {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(40px); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        .water-droplet {
          animation: drop 1.5s ease-in infinite;
        }
      `}</style>
      
      <div className="text-center mb-8 animate-fadeIn">
        <h1 className="text-4xl font-bold text-red-900 mb-2">Emma's</h1>
        <h2 className="text-3xl font-semibold text-red-600">Knitting Tracker</h2>
      </div>
      
      <button
        onClick={onStart}
        className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-amber-50 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 mb-8 animate-fadeIn"
      >
        Let's Knit
      </button>
      
      <div className="relative w-80 h-80 bg-sky-100 rounded-lg overflow-hidden shadow-xl animate-fadeIn" style={{imageRendering: 'pixelated'}}>
        <svg viewBox="0 0 128 128" className="w-full h-full">
          <rect x="0" y="100" width="128" height="28" fill="#86efac"/>
          <rect x="4" y="104" width="4" height="4" fill="#4ade80"/>
          <rect x="12" y="108" width="4" height="4" fill="#4ade80"/>
          <rect x="20" y="104" width="4" height="4" fill="#4ade80"/>
          <rect x="28" y="108" width="4" height="4" fill="#4ade80"/>
          <rect x="36" y="104" width="4" height="4" fill="#4ade80"/>
          <rect x="44" y="108" width="4" height="4" fill="#4ade80"/>
          <rect x="52" y="104" width="4" height="4" fill="#4ade80"/>
          <rect x="60" y="108" width="4" height="4" fill="#4ade80"/>
          <rect x="68" y="104" width="4" height="4" fill="#4ade80"/>
          <rect x="76" y="108" width="4" height="4" fill="#4ade80"/>
          <rect x="84" y="104" width="4" height="4" fill="#4ade80"/>
          <rect x="92" y="108" width="4" height="4" fill="#4ade80"/>
          <rect x="100" y="104" width="4" height="4" fill="#4ade80"/>
          <rect x="108" y="108" width="4" height="4" fill="#4ade80"/>
          <rect x="116" y="104" width="4" height="4" fill="#4ade80"/>
          
          <rect x="24" y="88" width="80" height="12" fill="#64748b"/>
          <rect x="28" y="92" width="72" height="8" fill="#94a3b8"/>
          <rect x="32" y="94" width="64" height="4" fill="#cbd5e1"/>
          
          <rect x="40" y="68" width="48" height="20" fill="#64748b"/>
          <rect x="44" y="72" width="40" height="8" fill="#94a3b8"/>
          <rect x="48" y="76" width="32" height="4" fill="#cbd5e1"/>
          
          <rect x="52" y="48" width="24" height="20" fill="#64748b"/>
          <rect x="56" y="52" width="16" height="8" fill="#94a3b8"/>
          <rect x="58" y="56" width="12" height="4" fill="#cbd5e1"/>
          
          <rect x="60" y="36" width="8" height="12" fill="#64748b"/>
          <rect x="62" y="38" width="4" height="8" fill="#94a3b8"/>
          
          <rect x="32" y="96" width="64" height="2" fill="#3b82f6" opacity="0.6"/>
          <rect x="48" y="78" width="32" height="2" fill="#3b82f6" opacity="0.6"/>
          <rect x="58" y="58" width="12" height="2" fill="#3b82f6" opacity="0.6"/>
          
          <rect x="62" y="30" width="4" height="4" fill="#60a5fa" className="water-droplet" style={{animationDelay: '0s'}} />
          <rect x="62" y="30" width="4" height="4" fill="#60a5fa" className="water-droplet" style={{animationDelay: '0.5s'}} />
          <rect x="62" y="30" width="4" height="4" fill="#60a5fa" className="water-droplet" style={{animationDelay: '1s'}} />
          
          <rect x="58" y="60" width="2" height="2" fill="#60a5fa" className="water-droplet" style={{animationDelay: '0.2s'}} />
          <rect x="68" y="60" width="2" height="2" fill="#60a5fa" className="water-droplet" style={{animationDelay: '0.6s'}} />
          <rect x="58" y="60" width="2" height="2" fill="#60a5fa" className="water-droplet" style={{animationDelay: '1.2s'}} />
          <rect x="68" y="60" width="2" height="2" fill="#60a5fa" className="water-droplet" style={{animationDelay: '0.8s'}} />
          
          <rect x="48" y="80" width="2" height="2" fill="#60a5fa" className="water-droplet" style={{animationDelay: '0.3s'}} />
          <rect x="78" y="80" width="2" height="2" fill="#60a5fa" className="water-droplet" style={{animationDelay: '0.7s'}} />
          <rect x="48" y="80" width="2" height="2" fill="#60a5fa" className="water-droplet" style={{animationDelay: '0.9s'}} />
          <rect x="78" y="80" width="2" height="2" fill="#60a5fa" className="water-droplet" style={{animationDelay: '1.3s'}} />
          
          <rect x="24" y="86" width="4" height="2" fill="#475569"/>
          <rect x="100" y="86" width="4" height="2" fill="#475569"/>
          <rect x="40" y="66" width="4" height="2" fill="#475569"/>
          <rect x="84" y="66" width="4" height="2" fill="#475569"/>
        </svg>
      </div>
    </div>
  );
};

const MessageScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-amber-50 to-red-50 flex items-center justify-center px-6 animate-fadeIn" style={{fontFamily: 'Times New Roman, serif'}}>
      <StitchBorder />
      <PixelCat />
      <div className="text-center">
        <p className="text-3xl font-light text-red-900 leading-relaxed">
          Enjoying your knitting Emma
        </p>
        <p className="text-2xl font-light text-red-700 mt-4">
          Love A ❤️
        </p>
      </div>
    </div>
  );
};

const HomePage = ({ greeting, zenQuote, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold text-red-900 mb-4">{greeting}</h1>
        <p className="text-red-700 italic max-w-md">"{zenQuote}"</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <button
          onClick={() => onNavigate('counting')}
          className="w-full bg-amber-50 rounded-2xl p-6 shadow-lg border-2 border-red-200 hover:shadow-xl hover:border-red-300 transition-all active:scale-98"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-red-500 to-red-600">
              <CounterIcon size={24} className="text-amber-50" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-red-900 text-lg">Counting</h3>
              <p className="text-sm text-red-700">Track your projects & progress</p>
            </div>
            <ChevronRight size={20} className="ml-auto text-red-400" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('library')}
          className="w-full bg-amber-50 rounded-2xl p-6 shadow-lg border-2 border-red-200 hover:shadow-xl hover:border-red-300 transition-all active:scale-98"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-red-500 to-red-600">
              <BookOpen size={24} className="text-amber-50" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-red-900 text-lg">Pattern Library</h3>
              <p className="text-sm text-red-700">Your collection of patterns</p>
            </div>
            <ChevronRight size={20} className="ml-auto text-red-400" />
          </div>
        </button>
      </div>
    </div>
  );
};

const CountingPage = ({ projects, onSelectProject, onNewProject, onDeleteProject, formatTime }) => {
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const activeProjects = projects.filter(p => p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');

  const handleDelete = (projectId, projectName) => {
    setDeleteConfirm({ id: projectId, name: projectName });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDeleteProject(deleteConfirm.id);
      setDeleteConfirm(null);
      setEditMode(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div>
      <div className="bg-amber-50/80 backdrop-blur-sm border-b-2 border-red-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-red-900">Counting</h1>
            <p className="text-sm text-red-700 mt-1">Track your active projects</p>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              editMode 
                ? 'bg-red-600 text-amber-50' 
                : 'bg-red-100 text-red-700'
            }`}
          >
            {editMode ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {activeProjects.length > 0 && (
          <div>
            <h2 className="text-lg font-medium text-red-800 mb-3">In Progress</h2>
            <div className="space-y-3">
              {activeProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onClick={() => !editMode && onSelectProject(project)}
                  formatTime={formatTime}
                  editMode={editMode}
                  onDelete={() => handleDelete(project.id, project.name)}
                />
              ))}
            </div>
          </div>
        )}

        {!editMode && (
          <button
            onClick={onNewProject}
            className="w-full bg-amber-50 rounded-2xl p-6 border-2 border-dashed border-red-300 hover:border-red-400 hover:bg-red-50/50 transition-all active:scale-98"
          >
            <div className="flex items-center justify-center gap-3 text-red-700">
              <Plus size={24} />
              <span className="font-medium">Start New Project</span>
            </div>
          </button>
        )}

        {completedProjects.length > 0 && (
          <div>
            <h2 className="text-lg font-medium text-red-800 mb-3">Completed</h2>
            <div className="space-y-3">
              {completedProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onClick={() => !editMode && onSelectProject(project)}
                  formatTime={formatTime}
                  completed
                  editMode={editMode}
                  onDelete={() => handleDelete(project.id, project.name)}
                />
              ))}
            </div>
          </div>
        )}

        {projects.length === 0 && (
          <div className="text-center py-16">
            <Heart size={48} className="mx-auto text-red-300 mb-4" />
            <p className="text-red-600">Start your first knitting project</p>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6" style={{ zIndex: 10000 }}>
          <div className="bg-amber-50 rounded-2xl p-6 max-w-sm w-full shadow-2xl border-2 border-red-200">
            <h3 className="text-xl font-semibold text-red-900 mb-3">Delete Project?</h3>
            <p className="text-red-800 mb-6">
              Are you sure you want to delete "<strong>{deleteConfirm.name}</strong>"? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 bg-stone-200 text-stone-700 rounded-xl font-medium hover:bg-stone-300 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-amber-50 rounded-xl font-medium hover:bg-red-700 transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LibraryPage = ({ patterns, onNewPattern, onDeletePattern }) => {
  return (
    <div>
      <div className="bg-amber-50/80 backdrop-blur-sm border-b-2 border-red-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-semibold text-red-900">Pattern Library</h1>
          <p className="text-sm text-red-700 mt-1">Your collection of patterns</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        <button
          onClick={onNewPattern}
          className="w-full bg-amber-50 rounded-2xl p-6 border-2 border-dashed border-red-300 hover:border-red-400 hover:bg-red-50/50 transition-all active:scale-98"
        >
          <div className="flex items-center justify-center gap-3 text-red-700">
            <Upload size={24} />
            <span className="font-medium">Upload New Pattern</span>
          </div>
        </button>

        {patterns.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {patterns.map(pattern => (
              <div
                key={pattern.id}
                className="bg-amber-50 rounded-2xl p-5 shadow-sm border-2 border-red-200 hover:shadow-md hover:border-red-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-red-100">
                      <FileText size={20} className="text-red-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900">{pattern.name}</h3>
                      {pattern.description && (
                        <p className="text-sm text-red-700 mt-1">{pattern.description}</p>
                      )}
                      {pattern.fileName && (
                        <p className="text-xs text-red-600 mt-2">{pattern.fileName}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this pattern?')) {
                        onDeletePattern(pattern.id);
                      }
                    }}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen size={48} className="mx-auto text-red-300 mb-4" />
            <p className="text-red-600">Upload your first pattern</p>
          </div>
        )}
      </div>
    </div>
  );
};

const NewPatternForm = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd({
        name: name.trim(),
        description: description.trim(),
        fileName: fileName || 'pattern.pdf'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-stone-50" style={{fontFamily: 'Times New Roman, serif'}}>
      <StitchBorder />
      <PixelCat />
      <div className="bg-amber-50/80 backdrop-blur-sm border-b-2 border-red-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onCancel} className="text-red-600 font-medium">Cancel</button>
          <h1 className="text-lg font-semibold text-red-900">New Pattern</h1>
          <button 
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="text-red-600 font-medium disabled:text-red-300"
          >
            Add
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        <div className="bg-amber-50 rounded-2xl shadow-sm border-2 border-red-200 overflow-hidden">
          <input
            type="text"
            placeholder="Pattern Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-4 text-red-900 placeholder-red-400 border-b-2 border-red-200 focus:outline-none bg-transparent"
            autoFocus
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-5 py-4 text-red-900 placeholder-red-400 focus:outline-none bg-transparent"
          />
        </div>

        <div className="bg-amber-50 rounded-2xl p-6 shadow-sm border-2 border-red-200">
          <label className="block">
            <div className="flex items-center justify-center gap-3 py-8 border-2 border-dashed border-red-300 rounded-xl cursor-pointer hover:border-red-400 hover:bg-red-50/50 transition-all">
              <Upload size={24} className="text-red-600" />
              <span className="text-red-700 font-medium">
                {fileName ? fileName : 'Upload PDF'}
              </span>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        
        <p className="text-sm text-red-700 px-1">Upload a PDF pattern to keep in your library.</p>
      </div>
    </div>
  );
};

const TabBar = ({ currentTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amber-50/95 backdrop-blur-lg border-t-2 border-red-200 safe-area-inset-bottom">
      <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-around">
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
            currentTab === 'home' ? 'text-red-600' : 'text-red-400'
          }`}
        >
          <Home size={24} />
          <span className="text-xs font-medium">Home</span>
        </button>
        
        <button
          onClick={() => onTabChange('counting')}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
            currentTab === 'counting' ? 'text-red-600' : 'text-red-400'
          }`}
        >
          <CounterIcon size={24} />
          <span className="text-xs font-medium">Counting</span>
        </button>
        
        <button
          onClick={() => onTabChange('library')}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
            currentTab === 'library' ? 'text-red-600' : 'text-red-400'
          }`}
        >
          <BookOpen size={24} />
          <span className="text-xs font-medium">Library</span>
        </button>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onClick, formatTime, completed, editMode, onDelete }) => {
  const progress = project.totalRows ? (project.currentRow / project.totalRows) * 100 : 0;
  
  return (
    <div className="relative">
      <div
        onClick={!editMode ? onClick : undefined}
        className={`w-full bg-amber-50 rounded-2xl p-5 shadow-sm border-2 border-red-200 transition-all text-left relative ${
          editMode ? 'opacity-60 cursor-default' : 'hover:shadow-md hover:border-red-300 active:scale-98 cursor-pointer'
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-red-900 text-lg">{project.name}</h3>
            <p className="text-sm text-red-700">{project.type}</p>
          </div>
          {completed && !editMode && <CheckCircle size={20} className="text-green-600" />}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm text-red-700">
            <span>Row {project.currentRow}{project.totalRows && ` / ${project.totalRows}`}</span>
            {project.totalTime > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatTime(project.totalTime)}
                </div>
              </>
            )}
          </div>
          
          {project.totalRows && (
            <div className="w-full bg-red-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        
        {!editMode && <ChevronRight size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-red-400" />}
      </div>
      
      {editMode && onDelete && (
        <button
          onClick={onDelete}
          type="button"
          className="absolute -right-3 -top-3 bg-red-600 text-amber-50 rounded-full p-4 shadow-xl hover:bg-red-700 active:bg-red-800 transition-all"
          style={{ zIndex: 9999, pointerEvents: 'auto' }}
        >
          <Trash2 size={22} />
        </button>
      )}
    </div>
  );
};

const NewProjectForm = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [totalRows, setTotalRows] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd({
        name: name.trim(),
        type: type.trim() || 'Knitting Project',
        totalRows: totalRows ? parseInt(totalRows) : null
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-stone-50" style={{fontFamily: 'Times New Roman, serif'}}>
      <StitchBorder />
      <PixelCat />
      <div className="bg-amber-50/80 backdrop-blur-sm border-b-2 border-red-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onCancel} className="text-red-600 font-medium">Cancel</button>
          <h1 className="text-lg font-semibold text-red-900">New Project</h1>
          <button 
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="text-red-600 font-medium disabled:text-red-300"
          >
            Add
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        <div className="bg-amber-50 rounded-2xl shadow-sm border-2 border-red-200 overflow-hidden">
          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-4 text-red-900 placeholder-red-400 border-b-2 border-red-200 focus:outline-none bg-transparent"
            autoFocus
          />
          <input
            type="text"
            placeholder="Type (e.g., Sweater, Scarf, Blanket)"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-5 py-4 text-red-900 placeholder-red-400 border-b-2 border-red-200 focus:outline-none bg-transparent"
          />
          <input
            type="number"
            placeholder="Total Rows (optional)"
            value={totalRows}
            onChange={(e) => setTotalRows(e.target.value)}
            className="w-full px-5 py-4 text-red-900 placeholder-red-400 focus:outline-none bg-transparent"
          />
        </div>
        
        <p className="text-sm text-red-700 px-1">You can add pattern details and notes after creating the project.</p>
      </div>
    </div>
  );
};

const ProjectView = ({ project, onBack, onUpdate, onToggleTimer, onAddNote, formatTime }) => {
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (project.startTime) {
      const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
      return () => clearInterval(interval);
    }
  }, [project.startTime]);

  const displayTime = project.startTime 
    ? project.totalTime + (currentTime - project.startTime)
    : project.totalTime;

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote(noteText.trim());
      setNoteText('');
    }
  };

  const progress = project.totalRows ? (project.currentRow / project.totalRows) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-stone-50 pb-20" style={{fontFamily: 'Times New Roman, serif'}}>
      <StitchBorder />
      <PixelCat />
      <div className="bg-amber-50/80 backdrop-blur-sm border-b-2 border-red-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="text-red-600 font-medium">← Back</button>
          <h1 className="text-lg font-semibold text-red-900">{project.name}</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        <div className="bg-amber-50 rounded-2xl p-6 shadow-sm border-2 border-red-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-red-700">{project.type}</p>
              {project.totalRows && (
                <p className="text-3xl font-bold text-red-900 mt-1">
                  {Math.round(progress)}%
                </p>
              )}
            </div>
            <button
              onClick={onToggleTimer}
              className={`p-4 rounded-full transition-all active:scale-95 ${
                project.startTime 
                  ? 'bg-red-600 text-amber-50 shadow-lg' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {project.startTime ? <Pause size={24} /> : <Play size={24} />}
            </button>
          </div>

          {project.totalRows && (
            <div className="w-full bg-red-100 rounded-full h-3 overflow-hidden mb-4">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-red-700">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{formatTime(displayTime)}</span>
            </div>
            {project.totalRows && (
              <span>Row {project.currentRow} / {project.totalRows}</span>
            )}
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-6 shadow-sm border-2 border-red-200">
          <h3 className="text-sm font-medium text-red-800 mb-4">Row Counter</h3>
          <div className="flex items-center justify-between">
            <button
              onClick={() => onUpdate({ currentRow: Math.max(0, project.currentRow - 1) })}
              className="w-16 h-16 rounded-full bg-red-100 text-red-700 text-2xl font-semibold active:scale-95 transition-all"
            >
              −
            </button>
            <div className="text-center">
              <div className="text-5xl font-bold text-red-900">{project.currentRow}</div>
              <div className="text-sm text-red-700 mt-1">rows</div>
            </div>
            <button
              onClick={() => onUpdate({ currentRow: project.currentRow + 1 })}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-amber-50 text-2xl font-semibold shadow-lg active:scale-95 transition-all"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-6 shadow-sm border-2 border-red-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-red-800">Notes</h3>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-red-600 text-sm font-medium"
            >
              {showNotes ? 'Hide' : 'Add Note'}
            </button>
          </div>

          {showNotes && (
            <div className="mb-4">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note about this row..."
                className="w-full px-4 py-3 rounded-xl bg-red-50 border-2 border-red-200 focus:outline-none focus:border-red-400 resize-none text-red-900 placeholder-red-400"
                rows={3}
              />
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className="mt-2 px-4 py-2 bg-red-600 text-amber-50 rounded-full text-sm font-medium disabled:opacity-50 active:scale-95 transition-all"
              >
                Save Note
              </button>
            </div>
          )}

          {project.notes.length > 0 ? (
            <div className="space-y-2">
              {project.notes.map(note => (
                <div key={note.id} className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-sm text-red-900">{note.text}</p>
                  <p className="text-xs text-red-600 mt-1">Row {note.row}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-red-500">No notes yet</p>
          )}
        </div>

        {project.status === 'active' && (
          <button
            onClick={() => onUpdate({ status: 'completed' })}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-medium shadow-lg active:scale-98 transition-all"
          >
            Mark as Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default KnittingTracker;
