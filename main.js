 // Loading Screen Animation
        let loadingPercentage = 0;
        const loadingInterval = setInterval(() => {
            loadingPercentage += Math.random() * 15;
            if (loadingPercentage >= 100) {
                loadingPercentage = 100;
                clearInterval(loadingInterval);
                setTimeout(() => {
                    document.getElementById('loadingScreen').classList.add('fade-out');
                    document.getElementById('mainContent').classList.add('loaded');
                }, 500);
            }
            document.getElementById('loadingPercentage').textContent = Math.floor(loadingPercentage) + '%';
        }, 200);

        // Card Click Handler with Ripple Effect
        function handleCardClick(event, sectionName) {
            const card = event.currentTarget;
            
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('card-click-effect');
            
            card.appendChild(ripple);
            
            // Add press animation
            card.classList.add('card-pressed');
            
            // Navigate after animation
            setTimeout(() => {
                showSection(sectionName);
            }, 150);
            
            // Clean up
            setTimeout(() => {
                ripple.remove();
                card.classList.remove('card-pressed');
            }, 600);
        }

        // Navigation Functions
        function showSection(sectionName) {
            // Save section visit to local storage
            LearningProgress.saveSectionVisit(sectionName);
            
            // Hide all sections with fade out
            const sections = document.querySelectorAll('.section-content');
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show selected section with delay for smooth transition
            setTimeout(() => {
                document.getElementById(sectionName).classList.add('active');
                
                // Animate content cards with stagger effect
                setTimeout(() => {
                    const contentCards = document.getElementById(sectionName).querySelectorAll('.content-card');
                    contentCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, index * 150); // Stagger animation by 150ms
                    });
                }, 100);
            }, 100);
            
            // Update navigation buttons
            const navButtons = document.querySelectorAll('.nav-btn');
            navButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('text-gray-600');
                btn.classList.remove('text-blue-600');
            });
            
            // Highlight active button
            if (event && event.target) {
                event.target.classList.add('active');
                event.target.classList.add('text-blue-600');
                event.target.classList.remove('text-gray-600');
            }
            
            // Show/hide back button with animation
            const backButton = document.getElementById('backButton');
            if (sectionName === 'beranda') {
                backButton.style.transform = 'translateX(-100px)';
                backButton.style.opacity = '0';
                setTimeout(() => {
                    backButton.classList.add('hidden');
                }, 300);
            } else {
                backButton.classList.remove('hidden');
                setTimeout(() => {
                    backButton.style.transform = 'translateX(0)';
                    backButton.style.opacity = '1';
                }, 50);
            }
            
            // Close mobile menu if open
            document.getElementById('mobileMenu').classList.add('hidden');
        }

        function goBackToHome() {
            // Check if we're currently in quiz section
            const currentSection = document.querySelector('.section-content.active');
            if (currentSection && currentSection.id === 'kuis') {
                // If in quiz and not at level selection, go back to level selection
                const quizStart = document.getElementById('quizStart');
                const quizQuestion = document.getElementById('quizQuestion');
                const quizResult = document.getElementById('quizResult');
                
                if (!quizStart.classList.contains('hidden')) {
                    // Already at level selection, go to homepage
                    goToHomepage();
                } else {
                    // Go back to level selection
                    quizQuestion.classList.add('hidden');
                    quizResult.classList.add('hidden');
                    quizStart.classList.remove('hidden');
                    
                    // Reset quiz state
                    currentQuestionIndex = 0;
                    score = 0;
                    selectedAnswer = null;
                    
                    // Keep the selected level if any
                    return;
                }
            } else {
                // For other sections, go to homepage
                goToHomepage();
            }
        }
        
        function goToHomepage() {
            // Reset content card animations
            const allContentCards = document.querySelectorAll('.content-card');
            allContentCards.forEach(card => {
                card.classList.remove('animate');
            });
            
            // Reset to home section
            showSection('beranda');
            
            // Update navigation to show home as active
            const navButtons = document.querySelectorAll('.nav-btn');
            navButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('text-gray-600');
                btn.classList.remove('text-blue-600');
            });
            
            // Set first nav button (Beranda) as active
            const homeButton = navButtons[0];
            if (homeButton) {
                homeButton.classList.add('active');
                homeButton.classList.add('text-blue-600');
                homeButton.classList.remove('text-gray-600');
            }
            
            // Scroll directly to learning cards section
            setTimeout(() => {
                const learningCardsSection = document.querySelector('.grid.sm\\:grid-cols-2.lg\\:grid-cols-3');
                if (learningCardsSection) {
                    learningCardsSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            }, 300);
        }

        function toggleMobileMenu() {
            const mobileMenu = document.getElementById('mobileMenu');
            mobileMenu.classList.toggle('hidden');
        }

        // Bible Tab Functions
        function showBibleTab(tabName) {
            // Hide all bible tabs
            const tabs = document.querySelectorAll('.bible-tab-content');
            tabs.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById(tabName).classList.add('active');
            
            // Update tab buttons
            const tabButtons = document.querySelectorAll('.tab-button');
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('text-gray-600');
            });
            
            // Highlight active tab button
            event.target.classList.add('active');
            event.target.classList.remove('text-gray-600');
        }

        // Local Storage Functions for Learning Progress
        const LearningProgress = {
            // Save quiz results
            saveQuizResult: function(level, score, totalQuestions, percentage) {
                const results = this.getQuizResults();
                const timestamp = new Date().toISOString();
                
                if (!results[level]) {
                    results[level] = [];
                }
                
                results[level].push({
                    score: score,
                    totalQuestions: totalQuestions,
                    percentage: percentage,
                    date: timestamp,
                    completed: true
                });
                
                // Keep only last 10 results per level
                if (results[level].length > 10) {
                    results[level] = results[level].slice(-10);
                }
                
                localStorage.setItem('christianLearning_quizResults', JSON.stringify(results));
                this.updateOverallProgress();
            },
            
            // Get quiz results
            getQuizResults: function() {
                const stored = localStorage.getItem('christianLearning_quizResults');
                return stored ? JSON.parse(stored) : {};
            },
            
            // Save section completion
            saveSectionVisit: function(sectionName) {
                const visits = this.getSectionVisits();
                const timestamp = new Date().toISOString();
                
                if (!visits[sectionName]) {
                    visits[sectionName] = [];
                }
                
                visits[sectionName].push(timestamp);
                
                // Keep only last 20 visits per section
                if (visits[sectionName].length > 20) {
                    visits[sectionName] = visits[sectionName].slice(-20);
                }
                
                localStorage.setItem('christianLearning_sectionVisits', JSON.stringify(visits));
                this.updateOverallProgress();
            },
            
            // Get section visits
            getSectionVisits: function() {
                const stored = localStorage.getItem('christianLearning_sectionVisits');
                return stored ? JSON.parse(stored) : {};
            },
            
            // Save reading progress for long content
            saveReadingProgress: function(sectionName, subsection, percentage) {
                const progress = this.getReadingProgress();
                
                if (!progress[sectionName]) {
                    progress[sectionName] = {};
                }
                
                progress[sectionName][subsection] = {
                    percentage: percentage,
                    lastRead: new Date().toISOString()
                };
                
                localStorage.setItem('christianLearning_readingProgress', JSON.stringify(progress));
            },
            
            // Get reading progress
            getReadingProgress: function() {
                const stored = localStorage.getItem('christianLearning_readingProgress');
                return stored ? JSON.parse(stored) : {};
            },
            
            // Update overall learning progress
            updateOverallProgress: function() {
                const quizResults = this.getQuizResults();
                const sectionVisits = this.getSectionVisits();
                const readingProgress = this.getReadingProgress();
                
                const progress = {
                    totalQuizzesTaken: Object.values(quizResults).reduce((total, levelResults) => total + levelResults.length, 0),
                    sectionsVisited: Object.keys(sectionVisits).length,
                    averageQuizScore: this.calculateAverageQuizScore(quizResults),
                    lastActivity: new Date().toISOString(),
                    studyStreak: this.calculateStudyStreak(sectionVisits, quizResults)
                };
                
                localStorage.setItem('christianLearning_overallProgress', JSON.stringify(progress));
                this.displayProgressStats();
            },
            
            // Calculate average quiz score
            calculateAverageQuizScore: function(quizResults) {
                let totalScore = 0;
                let totalQuizzes = 0;
                
                Object.values(quizResults).forEach(levelResults => {
                    levelResults.forEach(result => {
                        totalScore += result.percentage;
                        totalQuizzes++;
                    });
                });
                
                return totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0;
            },
            
            // Calculate study streak
            calculateStudyStreak: function(sectionVisits, quizResults) {
                const allActivities = [];
                
                // Collect all activities
                Object.values(sectionVisits).forEach(visits => {
                    allActivities.push(...visits);
                });
                
                Object.values(quizResults).forEach(levelResults => {
                    levelResults.forEach(result => {
                        allActivities.push(result.date);
                    });
                });
                
                if (allActivities.length === 0) return 0;
                
                // Sort by date
                allActivities.sort((a, b) => new Date(b) - new Date(a));
                
                // Calculate streak
                let streak = 0;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                for (let i = 0; i < allActivities.length; i++) {
                    const activityDate = new Date(allActivities[i]);
                    activityDate.setHours(0, 0, 0, 0);
                    
                    const daysDiff = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
                    
                    if (daysDiff === streak) {
                        streak++;
                    } else if (daysDiff > streak) {
                        break;
                    }
                }
                
                return streak;
            },
            
            // Display progress stats in UI
            displayProgressStats: function() {
                const stored = localStorage.getItem('christianLearning_overallProgress');
                if (!stored) return;
                
                const progress = JSON.parse(stored);
                
                // Update stats in hero section if elements exist
                const statsElements = document.querySelectorAll('.stats-counter');
                if (statsElements.length >= 4) {
                    // Add user progress to existing stats
                    if (progress.totalQuizzesTaken > 0) {
                        const quizStat = document.createElement('div');
                        quizStat.className = 'text-center stats-counter bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-sm border-2 border-blue-200';
                        quizStat.innerHTML = `
                            <div class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">${progress.totalQuizzesTaken}</div>
                            <p class="text-gray-600 text-xs sm:text-sm md:text-base">Kuis Selesai</p>
                        `;
                        
                        // Add to stats section if not already added
                        const statsContainer = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-4');
                        if (statsContainer && !document.querySelector('.border-blue-200')) {
                            statsContainer.appendChild(quizStat);
                            statsContainer.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12 lg:mb-16';
                        }
                    }
                }
            },
            
            // Get user achievements
            getAchievements: function() {
                const quizResults = this.getQuizResults();
                const sectionVisits = this.getSectionVisits();
                const progress = JSON.parse(localStorage.getItem('christianLearning_overallProgress') || '{}');
                
                const achievements = [];
                
                // Quiz achievements
                if (progress.totalQuizzesTaken >= 1) achievements.push('🎯 Pemula Kuis');
                if (progress.totalQuizzesTaken >= 5) achievements.push('📚 Pelajar Aktif');
                if (progress.totalQuizzesTaken >= 10) achievements.push('🏆 Master Kuis');
                
                // Score achievements
                if (progress.averageQuizScore >= 80) achievements.push('⭐ Nilai Tinggi');
                if (progress.averageQuizScore >= 90) achievements.push('🌟 Hampir Sempurna');
                if (progress.averageQuizScore === 100) achievements.push('💎 Sempurna');
                
                // Section achievements
                if (progress.sectionsVisited >= 3) achievements.push('🗺️ Penjelajah');
                if (progress.sectionsVisited >= 5) achievements.push('📖 Pembelajar Lengkap');
                
                // Streak achievements
                if (progress.studyStreak >= 3) achievements.push('🔥 Konsisten');
                if (progress.studyStreak >= 7) achievements.push('💪 Dedikasi Tinggi');
                
                return achievements;
            },
            
            // Reset all progress (for testing or user request)
            resetProgress: function() {
                localStorage.removeItem('christianLearning_quizResults');
                localStorage.removeItem('christianLearning_sectionVisits');
                localStorage.removeItem('christianLearning_readingProgress');
                localStorage.removeItem('christianLearning_overallProgress');
                console.log('Learning progress reset successfully');
            }
        };

        // Quiz Data by Level
        const quizQuestions = {
            mudah: [
                {
                    question: "Siapa yang lahir di Betlehem?",
                    options: ["Musa", "Daud", "Yesus", "Abraham"],
                    correct: 2
                },
                {
                    question: "Berapa jumlah murid Yesus?",
                    options: ["10", "11", "12", "13"],
                    correct: 2
                },
                {
                    question: "Kitab pertama dalam Alkitab adalah?",
                    options: ["Keluaran", "Kejadian", "Imamat", "Bilangan"],
                    correct: 1
                },
                {
                    question: "Siapa yang membangun bahtera?",
                    options: ["Nuh", "Abraham", "Musa", "Daud"],
                    correct: 0
                },
                {
                    question: "Hari apa Yesus bangkit dari kematian?",
                    options: ["Jumat", "Sabtu", "Minggu", "Senin"],
                    correct: 2
                },
                {
                    question: "Siapa ibu Yesus?",
                    options: ["Maria", "Marta", "Elisabet", "Rut"],
                    correct: 0
                },
                {
                    question: "Berapa perintah Allah yang diberikan kepada Musa?",
                    options: ["8", "10", "12", "15"],
                    correct: 1
                },
                {
                    question: "Siapa yang memimpin bangsa Israel keluar dari Mesir?",
                    options: ["Abraham", "Yusuf", "Musa", "Yosua"],
                    correct: 2
                },
                {
                    question: "Kota apa tempat Yesus dilahirkan?",
                    options: ["Nazaret", "Yerusalem", "Betlehem", "Kapernaum"],
                    correct: 2
                },
                {
                    question: "Siapa yang mengkhianati Yesus?",
                    options: ["Petrus", "Yudas", "Tomas", "Yohanes"],
                    correct: 1
                }
            ],
            sedang: [
                {
                    question: "Siapa yang memulai Reformasi Protestan pada tahun 1517?",
                    options: ["John Calvin", "Martin Luther", "Huldrych Zwingli", "John Knox"],
                    correct: 1
                },
                {
                    question: "Berapa jumlah kitab dalam Alkitab?",
                    options: ["64 kitab", "65 kitab", "66 kitab", "67 kitab"],
                    correct: 2
                },
                {
                    question: "Apa yang dimaksud dengan Trinitas?",
                    options: ["Tiga Allah yang berbeda", "Allah yang satu dalam tiga pribadi", "Tiga cara Allah bekerja", "Tiga sifat Allah"],
                    correct: 1
                },
                {
                    question: "Siapa penulis Injil yang paling banyak?",
                    options: ["Matius", "Markus", "Lukas", "Yohanes"],
                    correct: 2
                },
                {
                    question: "Kapan Konsili Nicea I diadakan?",
                    options: ["313 M", "325 M", "381 M", "451 M"],
                    correct: 1
                },
                {
                    question: "Apa buah Roh yang pertama disebutkan dalam Galatia 5:22?",
                    options: ["Sukacita", "Kasih", "Damai sejahtera", "Kesabaran"],
                    correct: 1
                },
                {
                    question: "Siapa yang dikenal sebagai 'Rasul bagi bangsa-bangsa lain'?",
                    options: ["Petrus", "Yohanes", "Paulus", "Yakobus"],
                    correct: 2
                },
                {
                    question: "Berapa kitab dalam Perjanjian Lama?",
                    options: ["37", "38", "39", "40"],
                    correct: 2
                },
                {
                    question: "Siapa raja Israel yang membangun Bait Suci pertama?",
                    options: ["Daud", "Salomo", "Saul", "Yosia"],
                    correct: 1
                },
                {
                    question: "Apa nama surat Paulus yang pertama ditulis?",
                    options: ["Roma", "1 Korintus", "Galatia", "1 Tesalonika"],
                    correct: 3
                }
            ],
            sulit: [
                {
                    question: "Siapa Bapa Gereja yang menulis 'Confessions'?",
                    options: ["Yohanes Krisostomus", "Agustinus", "Hieronimus", "Ambrosius"],
                    correct: 1
                },
                {
                    question: "Apa istilah teologi untuk doktrin tentang akhir zaman?",
                    options: ["Pneumatologi", "Kristologi", "Eskatologi", "Soteriologi"],
                    correct: 2
                },
                {
                    question: "Konsili mana yang menetapkan kanon Alkitab Perjanjian Baru?",
                    options: ["Nicea I", "Konstantinopel I", "Kartago III", "Chalcedon"],
                    correct: 2
                },
                {
                    question: "Apa nama bidat yang mengajarkan bahwa Yesus hanya tampak manusia?",
                    options: ["Arianisme", "Nestorianisme", "Doketisme", "Monofisitisme"],
                    correct: 2
                },
                {
                    question: "Siapa teolog yang mengembangkan teologi Reformed?",
                    options: ["Martin Luther", "John Calvin", "Huldrych Zwingli", "Philip Melanchthon"],
                    correct: 1
                },
                {
                    question: "Apa istilah untuk sifat Allah yang tidak dapat berubah?",
                    options: ["Immanence", "Transcendence", "Immutability", "Omnipresence"],
                    correct: 2
                },
                {
                    question: "Siapa yang menulis 'Summa Theologica'?",
                    options: ["Agustinus", "Thomas Aquinas", "Anselmus", "Duns Scotus"],
                    correct: 1
                },
                {
                    question: "Apa nama gerakan kebangunan rohani abad ke-18 di Inggris?",
                    options: ["Puritanisme", "Pietisme", "Metodisme", "Revivalisme"],
                    correct: 2
                },
                {
                    question: "Siapa Bapa Gereja yang dikenal dengan sebutan 'Mulut Emas'?",
                    options: ["Basil Agung", "Gregorius Nazianzus", "Yohanes Krisostomus", "Gregorius dari Nisa"],
                    correct: 2
                },
                {
                    question: "Apa istilah untuk persatuan dua kodrat dalam Kristus?",
                    options: ["Hypostatic Union", "Communicatio Idiomatum", "Theosis", "Kenosis"],
                    correct: 0
                }
            ]
        };

        let currentQuestionIndex = 0;
        let score = 0;
        let selectedAnswer = null;
        let currentLevel = 'mudah';
        let currentQuestions = [];

        function selectLevel(level) {
            currentLevel = level;
            currentQuestions = quizQuestions[level];
            
            // Update UI
            const levelNames = {
                'mudah': 'Mudah 🌱',
                'sedang': 'Sedang 🔥', 
                'sulit': 'Sulit ⚡'
            };
            
            document.getElementById('levelName').textContent = levelNames[level];
            document.getElementById('selectedLevel').classList.remove('hidden');
            
            // Highlight selected level
            document.querySelectorAll('[onclick^="selectLevel"]').forEach(card => {
                card.classList.remove('ring-4', 'ring-blue-300');
            });
            event.target.closest('div').classList.add('ring-4', 'ring-blue-300');
        }

        function startQuiz() {
            document.getElementById('quizStart').classList.add('hidden');
            document.getElementById('quizQuestion').classList.remove('hidden');
            currentQuestionIndex = 0;
            score = 0;
            
            // Set level display
            const levelNames = {
                'mudah': 'Mudah 🌱',
                'sedang': 'Sedang 🔥', 
                'sulit': 'Sulit ⚡'
            };
            document.getElementById('currentLevelDisplay').textContent = levelNames[currentLevel];
            
            showQuestion();
        }

        function showQuestion() {
            const question = currentQuestions[currentQuestionIndex];
            document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
            document.getElementById('questionText').textContent = question.question;
            
            const progressPercent = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
            document.getElementById('progressBar').style.width = progressPercent + '%';
            
            const optionsContainer = document.getElementById('answerOptions');
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'quiz-option p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors';
                optionDiv.innerHTML = `
                    <div class="flex items-center">
                        <span class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 font-semibold">${String.fromCharCode(65 + index)}</span>
                        <span>${option}</span>
                    </div>
                `;
                optionDiv.onclick = () => selectAnswer(index, optionDiv);
                optionsContainer.appendChild(optionDiv);
            });
            
            selectedAnswer = null;
            document.getElementById('nextButton').classList.add('hidden');
        }

        function selectAnswer(answerIndex, optionElement) {
            // Remove previous selections
            document.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('bg-blue-100', 'border-blue-500', 'ring-2', 'ring-blue-300');
                opt.classList.add('border-gray-200');
            });
            
            selectedAnswer = answerIndex;
            const question = currentQuestions[currentQuestionIndex];
            
            // Highlight selected answer
            optionElement.classList.add('bg-blue-100', 'border-blue-500', 'ring-2', 'ring-blue-300');
            optionElement.classList.remove('border-gray-200');
            
            // Update score silently (don't show if correct or not)
            if (answerIndex === question.correct) {
                score += 10;
            }
            
            // Show next button
            document.getElementById('nextButton').classList.remove('hidden');
        }

        function nextQuestion() {
            currentQuestionIndex++;
            
            if (currentQuestionIndex < currentQuestions.length) {
                showQuestion();
            } else {
                showResult();
            }
        }

        function showResult() {
            document.getElementById('quizQuestion').classList.add('hidden');
            document.getElementById('quizResult').classList.remove('hidden');
            
            const percentage = (score / (currentQuestions.length * 10)) * 100;
            document.getElementById('finalScore').textContent = score + ' / ' + (currentQuestions.length * 10);
            
            // Save quiz result to local storage
            LearningProgress.saveQuizResult(currentLevel, score, currentQuestions.length, percentage);
            
            let resultIcon, resultTitle, resultMessage;
            
            const levelNames = {
                'mudah': 'Level Mudah',
                'sedang': 'Level Sedang', 
                'sulit': 'Level Sulit'
            };
            
            // Get achievements to show
            const achievements = LearningProgress.getAchievements();
            const newAchievements = achievements.slice(-2); // Show last 2 achievements
            
            if (percentage >= 80) {
                resultIcon = '🏆';
                resultTitle = 'Luar Biasa!';
                resultMessage = `Anda menguasai ${levelNames[currentLevel]} dengan sangat baik! ${percentage.toFixed(0)}% jawaban benar. Terus pertahankan semangat belajar!`;
            } else if (percentage >= 60) {
                resultIcon = '👏';
                resultTitle = 'Bagus!';
                resultMessage = `Pemahaman Anda di ${levelNames[currentLevel]} cukup baik dengan ${percentage.toFixed(0)}% jawaban benar. Terus belajar untuk memperdalam pengetahuan!`;
            } else {
                resultIcon = '📚';
                resultTitle = 'Terus Belajar!';
                resultMessage = `Jangan menyerah! Anda mendapat ${percentage.toFixed(0)}% di ${levelNames[currentLevel]}. Gunakan materi pembelajaran untuk memperdalam pemahaman Anda.`;
            }
            
            // Add achievements to message if any
            if (newAchievements.length > 0) {
                resultMessage += `\n\n🎉 Pencapaian Baru: ${newAchievements.join(', ')}`;
            }
            
            document.getElementById('resultIcon').textContent = resultIcon;
            document.getElementById('resultTitle').textContent = resultTitle;
            document.getElementById('resultMessage').textContent = resultMessage;
            
            // Add progress stats to result
            const progress = JSON.parse(localStorage.getItem('christianLearning_overallProgress') || '{}');
            if (progress.totalQuizzesTaken > 1) {
                const progressInfo = document.createElement('div');
                progressInfo.className = 'mt-4 p-4 bg-blue-50 rounded-lg text-sm';
                progressInfo.innerHTML = `
                    <div class="text-center">
                        <p class="text-blue-800 font-semibold">📊 Progress Pembelajaran Anda:</p>
                        <div class="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <span class="font-bold text-blue-600">${progress.totalQuizzesTaken}</span>
                                <p class="text-blue-700">Total Kuis</p>
                            </div>
                            <div>
                                <span class="font-bold text-blue-600">${progress.averageQuizScore}%</span>
                                <p class="text-blue-700">Rata-rata Nilai</p>
                            </div>
                        </div>
                    </div>
                `;
                
                const resultContainer = document.getElementById('quizResult');
                const finalScoreElement = resultContainer.querySelector('.bg-gray-50');
                if (finalScoreElement && !resultContainer.querySelector('.bg-blue-50')) {
                    finalScoreElement.parentNode.insertBefore(progressInfo, finalScoreElement.nextSibling);
                }
            }
        }

        function restartQuiz() {
            document.getElementById('quizResult').classList.add('hidden');
            document.getElementById('quizStart').classList.remove('hidden');
            document.getElementById('selectedLevel').classList.add('hidden');
            
            // Reset level selection
            document.querySelectorAll('[onclick^="selectLevel"]').forEach(card => {
                card.classList.remove('ring-4', 'ring-blue-300');
            });
            
            currentQuestionIndex = 0;
            score = 0;
            currentLevel = 'mudah';
            currentQuestions = [];
        }

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            // Set initial active section
            document.getElementById('beranda').classList.add('active');
            
            // Initialize learning progress tracking
            LearningProgress.updateOverallProgress();
            
            // Load and display any existing progress
            setTimeout(() => {
                LearningProgress.displayProgressStats();
            }, 1000);
            
            // Add scroll tracking for reading progress
            let scrollTimeout;
            window.addEventListener('scroll', function() {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const activeSection = document.querySelector('.section-content.active');
                    if (activeSection && activeSection.id !== 'beranda' && activeSection.id !== 'kuis') {
                        const scrollPercent = Math.min(100, Math.round(
                            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                        ));
                        
                        if (scrollPercent > 10) { // Only save if user has scrolled significantly
                            LearningProgress.saveReadingProgress(activeSection.id, 'main', scrollPercent);
                        }
                    }
                }, 1000);
            });
            
            // Show welcome message for returning users
            const progress = JSON.parse(localStorage.getItem('christianLearning_overallProgress') || '{}');
            if (progress.totalQuizzesTaken > 0) {
                setTimeout(() => {
                    const welcomeMessage = document.createElement('div');
                    welcomeMessage.className = 'fixed top-20 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
                    welcomeMessage.innerHTML = `
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-semibold">Selamat datang kembali! 👋</p>
                                <p class="text-sm opacity-90">Anda telah menyelesaikan ${progress.totalQuizzesTaken} kuis</p>
                            </div>
                            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                    `;
                    
                    document.body.appendChild(welcomeMessage);
                    
                    // Auto remove after 5 seconds
                    setTimeout(() => {
                        if (welcomeMessage.parentElement) {
                            welcomeMessage.remove();
                        }
                    }, 5000);
                }, 2000);
            }
        });
        
        (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'977adb537486ef69',t:'MTc1NjYyNTc4NS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();