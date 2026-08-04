/* ==========================================================================
   CALHAS AÇOTEK - ARQUIVO PRINCIPAL DE INTERATIVIDADE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. NAVEGAÇÃO E SIDEBAR
       ========================================================================== */
    
    // Menu Mobile (Hambúrguer)
    const navSlide = () => {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');

        if (burger && nav) {
            burger.addEventListener('click', () => {
                nav.classList.toggle('nav-active');
                burger.classList.toggle('toggle');
                
                // Animação dos links no menu mobile
                navLinks.forEach((link, index) => {
                    if (link.style.animation) {
                        link.style.animation = '';
                    } else {
                        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                    }
                });
            });
        }
    }

    // Sidebar de Contato / Orçamento Rápido ("Fale Conosco")
    const workSidebar = () => {
        const btnOpen = document.getElementById('open-work');
        const sidebar = document.querySelector('.sidebar');
        const closeBtn = document.querySelector('.close-btn');
        const overlay = document.querySelector('.overlay');

        if (!sidebar || !overlay) return;

        const openSidebar = (e) => {
            if (e) e.preventDefault();
            sidebar.classList.add('active');
            overlay.classList.add('active');
            
            // Fecha menu mobile se estiver aberto ao ativar a sidebar
            const nav = document.querySelector('.nav-links');
            const burger = document.querySelector('.burger');
            if (nav && nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                if (burger) burger.classList.remove('toggle');
            }
        };

        const closeSidebar = () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        };

        if (btnOpen) btnOpen.addEventListener('click', openSidebar);
        if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
        if (overlay) overlay.addEventListener('click', closeSidebar);
    }

    /* ==========================================================================
       2. FORMULÁRIO DE CONTATO E SOLICITAÇÃO DE ORÇAMENTO
       ========================================================================== */
    const handleFormSubmit = () => {
        // Tenta localizar o formulário pelo ID padrão do HTML
        const form = document.getElementById("contactForm") || document.getElementById("emailForm");
        
        if (form) {
            async function handleSubmit(event) {
                event.preventDefault();
                
                let status = document.getElementById("form-status");
                if (!status) {
                    status = document.createElement('div');
                    status.id = 'form-status';
                    form.appendChild(status);
                }

                const data = new FormData(event.target);
                
                status.innerHTML = "Processando solicitação...";
                status.className = "sending";

                /*
                   💡 OPÇÃO A: Envio padrão via Formspree / Backend API
                   Se você usa Formspree ou FormSubmit no atributo action="" do HTML:
                */
                fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                }).then(response => {
                    if (response.ok) {
                        status.innerHTML = "Orçamento enviado com sucesso! Entraremos em contato em breve.";
                        status.className = "success";
                        form.reset();
                    } else {
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                            } else {
                                status.innerHTML = "Ocorreu um erro ao enviar seu orçamento.";
                            }
                            status.className = "error";
                        });
                    }
                }).catch(error => {
                    status.innerHTML = "Ocorreu um erro ao conectar com o servidor.";
                    status.className = "error";
                });

                /*
                   📲 OPÇÃO B (INTEGRAÇÃO WHATSAPP DIRETO DA AÇOTEK):
                   Se preferir enviar os dados do formulário direto para o WhatsApp comercial,
                   descomente o bloco abaixo e insira o número real da empresa:
                   
                   const nome = data.get('name') || 'Cliente';
                   const telefone = data.get('phone') || '';
                   const servico = data.get('service') || 'Calhas e Rufos';
                   const mensagem = data.get('message') || '';
                   const whatsAppNumber = "5511999999999"; // Coloque o número com DDD aqui

                   const textoWhats = `Olá Açotek! Meu nome é *${nome}*.%0A` +
                                      `Preciso de orçamento para: *${servico}*.%0A` +
                                      `Mensagem: ${mensagem}%0A` +
                                      `Contato: ${telefone}`;
                                      
                   window.open(`https://wa.me/${whatsAppNumber}?text=${textoWhats}`, '_blank');
                */
            }
            form.addEventListener("submit", handleSubmit);
        }
    }

    /* ==========================================================================
       3. CARROSSEL DE IMAGENS DA AÇOTEK (GALERIA / OBRAS / PRODUTOS)
       ========================================================================== */
    class Carousel {
        constructor(elementId, autoPlayDelay) {
            this.container = document.getElementById(elementId);
            if (!this.container) return;

            this.track = this.container.querySelector('.slides-track');
            this.slides = this.container.querySelectorAll('.slide');
            this.prevBtn = this.container.querySelector('.prev-slide');
            this.nextBtn = this.container.querySelector('.next-slide');
            
            if (!this.track || this.slides.length === 0) return;

            this.currentIndex = 0;
            this.totalSlides = this.slides.length;

            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => {
                    this.moveSlide(-1);
                    this.resetTimer();
                });
            }

            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => {
                    this.moveSlide(1);
                    this.resetTimer();
                });
            }

            if (autoPlayDelay > 0) {
                setTimeout(() => {
                    this.startAutoPlay();
                }, autoPlayDelay);
            }
        }

        updateTrack() {
            this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        }

        moveSlide(direction) {
            this.currentIndex += direction;

            if (this.currentIndex >= this.totalSlides) {
                this.currentIndex = 0;
            } else if (this.currentIndex < 0) {
                this.currentIndex = this.totalSlides - 1;
            }

            this.updateTrack();
        }

        startAutoPlay() {
            this.interval = setInterval(() => {
                this.moveSlide(1);
            }, 5000);
        }

        resetTimer() {
            if (this.interval) clearInterval(this.interval);
            this.startAutoPlay();
        }
    }

    /* ==========================================================================
       4. SISTEMA DE ANIMAÇÕES AO SCROLL (INTERSECTION OBSERVER)
       ========================================================================== */
    
    // Animação MVV (Missão, Visão e Valores da Açotek)
    const animateOnScroll = () => {
        const cards = document.querySelectorAll('.mvv-anim-card');
        if (cards.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('mvv-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });

        cards.forEach(card => observer.observe(card));
    }

    // Animação Mista (Sobre Nós / Linha do Tempo)
    const animateMixed = () => {
        const items = document.querySelectorAll('.mixed-item');
        if (items.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        items.forEach(item => observer.observe(item));
    }

    // Animação Clean List (Passo a passo de fabricação/instalação)
    const animateCleanList = () => {
        const steps = document.querySelectorAll('.clean-step');
        if (steps.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        steps.forEach(step => observer.observe(step));
    }

    // Animação de Texto em Cascata (Seção de Serviços)
    const animateServiceRows = () => {
        const rows = document.querySelectorAll('.service-row');
        if (rows.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const textElements = entry.target.querySelectorAll('.text-animate');
                    textElements.forEach(el => el.classList.add('visible'));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        rows.forEach(row => observer.observe(row));
    }

    /* ==========================================================================
       5. FAQ (PERGUNTAS FREQUENTES SOBRE CALHAS, RUFOS E PINGADEIRAS)
       ========================================================================== */
    const initFAQ = () => {
        const questions = document.querySelectorAll('.faq-question');

        if (questions.length > 0) {
            questions.forEach(question => {
                question.addEventListener('click', () => {
                    question.classList.toggle('active');
                    const answer = question.nextElementSibling;
                    
                    if (answer) {
                        if (question.classList.contains('active')) {
                            answer.style.maxHeight = answer.scrollHeight + "px";
                        } else {
                            answer.style.maxHeight = null;
                        }
                    }
                });
            });
        }
    }

    /* ==========================================================================
       INICIALIZAÇÃO GERAL DOS MÓDULOS
       ========================================================================== */
    navSlide();
    workSidebar();
    handleFormSubmit();
    initFAQ();
    
    // Ativa animações de tela
    animateOnScroll();
    animateMixed();
    animateCleanList();
    animateServiceRows();

    /* 
       🖼️ CONFIGURAÇÃO DOS CARROSSEIS NO HTML:
       Certifique-se de que no seu index.html as divs tenham esses IDs correspondentes:
       - id="carousel-ops"  -> Carrossel de Obras/Instalações
       - id="carousel-dist" -> Carrossel de Produtos/Calhas Dobradas
       - id="carousel-serv" -> Carrossel de Estruturas/Rufos
    */
    new Carousel('carousel-ops', 0);
    new Carousel('carousel-dist', 1500);
    new Carousel('carousel-serv', 3000);

});

/* ==========================================================================
   FORÇAR AUTOPLAY NO VÍDEO DE FUNDO (HERO SECTION / MOBILE)
   ========================================================================== */
window.addEventListener('load', () => {
    const video = document.querySelector('.back-video');
    
    if (video) {
        // Mudo obrigatório para políticas de autoplay dos navegadores (Safari/Chrome Mobile)
        video.muted = true;
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                console.log("Vídeo institucional da Açotek rodando perfeitamente.");
            })
            .catch(error => {
                console.log("Autoplay bloqueado pelo navegador do celular.");
            });
        }
    }
});