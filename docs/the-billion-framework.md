# The Billion — Project Framework

**Mission:** See over 1 billion people accept the gospel of Jesus Christ through AI-powered, scalable technology.

**Founder:** Dan (Couch Potatoes / Austin, TX)

**Core Insight:** AI fundamentally changes the math on global evangelism. A single server can host a million simultaneous gospel conversations. No human missionary force could ever do that. The technology exists — someone just needs to build it with conviction.

---

## Vision

Every piece of this ecosystem serves one purpose: getting the gospel in front of people in a way that is personal, culturally intelligent, available 24/7, in any language, and connected to a discipleship pathway. The furniture business is the tent-making engine that funds it. The technology is the multiplier.

---

## Architecture Overview

The ecosystem is built in five layers, each reinforcing the others:

| Layer | Purpose | Summary |
|-------|---------|---------|
| 1. Conversational Gospel AI | The core engine | AI that has personal, culturally aware gospel conversations |
| 2. Prayer Engine | The heartbeat | AI-led prayer, prayer teaching, and a global prayer network of real intercessors |
| 3. Human Connection Layer | People behind the platform | Real believers available for handoff, mentoring, follow-up, and pastoral care |
| 4. Voice & Audio Layer | Reach oral cultures | Real-time voice conversations, audio Bibles, spoken discipleship for non-literate populations |
| 5. Distribution Network | Reach billions | Multi-platform presence wherever people already are |
| 6. Video & Visual Content Engine | Dominant medium worldwide | AI-generated short-form video, culturally adapted visual content, testimony dubbing |
| 7. Discipleship Pipeline | Hearing → believing → growing | Gamified engagement, age-appropriate tracks, trauma/recovery pathways |
| 8. Digital Missionary Platform | Multiply the workforce | Equip thousands of believers to use the platform as their evangelism tool |
| 9. Intelligence Layer | Strategic brain | Identifies gaps, generates content, church planting intelligence |
| 10. Strategic Partnerships | Force multipliers | YouVersion, The Chosen, Hallow, He Gets Us, business chaplains, missions orgs |
| 11. Closed Countries & Unreached Peoples | The frontier | Encrypted access, anti-persecution intelligence, dream/vision response |
| 12. Offline & Low-Connectivity Mode | Last-mile access | SMS, feature phones, offline content, intermittent sync |
| 13. Funding Engine | Sustainability | Business-funded, self-sustaining, not dependent on donations |

---

## Technical Architecture: Dual-Model Gospel Orchestration Platform

**What to call it:** A dual-model orchestration platform with a proprietary voice engine, RAG knowledge system, and human-in-the-loop refinement.

**Simple version:** "We built a platform that gives the gospel a voice in every language on earth, 24/7, and meets people in personal conversation the way Jesus did."

**Ownership principle:** We own the voice. No AI company can shut us down, change our theology, or control how we communicate the gospel. The voice model runs on our infrastructure. It's ours forever.

### The Dual-Model Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      DISTRIBUTION LAYER                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ ┌───────────┐  │
│  │ WhatsApp │ │ Telegram │ │   Web    │ │ Mobile │ │  Church   │  │
│  │   Bot    │ │   Bot    │ │  Widget  │ │  Apps  │ │  Embed    │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘ └─────┬─────┘  │
│       └─────────────┴──────┬─────┴────────────┴────────────┘        │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 THE ORCHESTRATOR (Our Code, Our Logic)               │
│                                                                     │
│  This is custom software WE build and own. It controls everything.  │
│  The AI models are tools it calls — like CNC software calling a     │
│  motor controller. The models don't decide. The orchestrator does.  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  INPUT CLASSIFIER                            │   │
│  │  Evaluates: Intent, emotional state, journey stage,          │   │
│  │  language, cultural context, crisis detection                │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │               CONVERSATION STATE MANAGER                     │  │
│  │                                                              │  │
│  │  Tracks: Journey stage (curious → seeking → wrestling →      │  │
│  │  deciding → new believer → growing disciple)                 │  │
│  │                                                              │  │
│  │  Routes to appropriate conversation strategy                 │  │
│  └──────────────────────────┬───────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│  ┌──────────────┐  ┌────────────────┐  ┌────────────────────────┐  │
│  │  THEOLOGICAL │  │   RAG ENGINE   │  │   THEOLOGICAL          │  │
│  │  FRAMEWORK   │  │                │  │   GUARDRAILS           │  │
│  │  (System     │  │ Searches:      │  │                        │  │
│  │   Prompt)    │  │ • Scripture    │  │ • Doctrinal validator  │  │
│  │              │  │ • Apologetics  │  │ • Non-negotiable rules │  │
│  │ Written from │  │ • Testimonies  │  │ • Output screening     │  │
│  │ Jesus'       │  │ • Cultural     │  │ • Contradiction check  │  │
│  │ perspective  │  │   context DB   │  │ • Scripture accuracy   │  │
│  └──────┬───────┘  └───────┬────────┘  └───────────┬────────────┘  │
│         └──────────────────┼────────────────────────┘               │
│                            │                                        │
│                            ▼                                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    DUAL-MODEL ENGINE                          │  │
│  │                                                              │  │
│  │  ┌─────────────────────┐    ┌─────────────────────────────┐ │  │
│  │  │  MODEL A: THE BRAIN │    │  MODEL B: THE VOICE         │ │  │
│  │  │  (External LLM API) │    │  (OUR MODEL — We Own This)  │ │  │
│  │  │                     │    │                             │ │  │
│  │  │  • Claude/other API │    │  • Open-source base         │ │  │
│  │  │  • Handles:         │    │    (Llama/Mistral)          │ │  │
│  │  │    - Knowledge      │    │  • Fine-tuned on OUR data   │ │  │
│  │  │    - Reasoning      │    │  • RLHF from OUR reviewers  │ │  │
│  │  │    - Complex Q&A    │    │  • Handles:                 │ │  │
│  │  │    - Rare languages │    │    - Tone & warmth          │ │  │
│  │  │  • REPLACEABLE      │    │    - Conversational rhythm  │ │  │
│  │  │    If any API shuts │    │    - Jesus-like method      │ │  │
│  │  │    down, swap in    │    │    - Pastoral instincts     │ │  │
│  │  │    another. Our     │    │    - Parable-telling        │ │  │
│  │  │    platform doesn't │    │  • OURS FOREVER             │ │  │
│  │  │    change.          │    │    Runs on our hardware.    │ │  │
│  │  │                     │    │    Downloaded weights we    │ │  │
│  │  │                     │    │    own. No API dependency.  │ │  │
│  │  │                     │    │    No kill switch.          │ │  │
│  │  └─────────┬───────────┘    └──────────────┬──────────────┘ │  │
│  │            │                                │                │  │
│  │            └──────────┬─────────────────────┘                │  │
│  │                       │                                      │  │
│  │            Orchestrator combines:                            │  │
│  │            Brain's knowledge + Voice's delivery              │  │
│  └───────────────────────┬──────────────────────────────────────┘  │
│                          │                                         │
│                          ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   OUTPUT VALIDATOR                            │  │
│  │                                                              │  │
│  │  ✅ Doctrinally sound?     ✅ Appropriate tone?               │  │
│  │  ✅ Contradicts scripture?  ✅ Makes false promises?           │  │
│  │  ✅ Crisis requiring human? ✅ Voice model quality check       │  │
│  └──────────┬──────┬────────────────────────────────────────────┘  │
│        PASS │      │ ESCALATE                                      │
│             ▼      ▼                                               │
│  ┌──────────┐  ┌──────────────────┐                               │
│  │ Deliver  │  │ HUMAN LAYER      │                               │
│  │ Response │  │ • Crisis team    │                               │
│  │ to User  │  │ • Live pastors   │                               │
│  └──────────┘  │ • Prayer network │                               │
│                │ • Mentor match   │                               │
│                └──────────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  RLHF FEEDBACK LOOP (Continuous)                    │
│                                                                     │
│  Every conversation is reviewed by pastors, missionaries, and       │
│  theologians. Their ratings feed back into Model B training.        │
│  The voice model gets better with every conversation.               │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐    │
│  │  Theological │  │    Tone      │  │  "Would Jesus Say     │    │
│  │  Accuracy    │  │    Score     │  │   It This Way?"       │    │
│  │  Score (1-5) │  │    (1-5)     │  │   Score (1-5)         │    │
│  └──────────────┘  └──────────────┘  └───────────────────────┘    │
│                                                                     │
│  Quarterly retraining → Model B improves → Voice gets closer       │
│  to what Jesus would actually say in every situation                │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      KNOWLEDGE BASE                                 │
│                                                                     │
│  ┌────────────┐ ┌──────────────┐ ┌─────────────┐ ┌──────────────┐ │
│  │ Scripture  │ │ Apologetics  │ │ Testimonies │ │  Cultural    │ │
│  │ (multiple  │ │ Library      │ │ & Stories   │ │  Context DB  │ │
│  │ translations│ │              │ │ (by region/ │ │  (by people  │ │
│  │ & languages)│ │ • Problem of │ │  culture)   │ │   group)     │ │
│  │            │ │   evil       │ │             │ │ • Hindu bg   │ │
│  │            │ │ • Science &  │ │             │ │ • Muslim bg  │ │
│  │            │ │   faith      │ │             │ │ • Secular bg │ │
│  │            │ │ • Other      │ │             │ │ • Buddhist bg│ │
│  │            │ │   religions  │ │             │ │ • Animist bg │ │
│  │            │ │ • Historicity│ │             │ │              │ │
│  └────────────┘ └──────────────┘ └─────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Why Two Models?

Think of it like your CNC operation:

| CNC Analogy | The Billion |
|-------------|-------------|
| Duet 3 board (motor controller) | Model A: The Brain (Claude API) — powerful, handles the hard computation |
| Your custom cutting software | The Orchestrator — your code, your logic, controls everything |
| The operator's skill and instinct | Model B: The Voice — trained on YOUR standards, YOUR pastoral wisdom |
| The finished sofa | The response delivered to the user |

You didn't build the Duet 3 chip. But you built the software that tells it what to do, and YOU are the craftsman whose skill makes the difference. Same here. You don't need to build the brain. You need to own the voice and the orchestrator.

**Model A is replaceable.** If Anthropic raises prices, you swap in OpenAI. If OpenAI changes terms, you swap in an open-source brain. Your platform doesn't change because the orchestrator and voice model are yours.

**Model B is irreplaceable.** It's trained on your data, reviewed by your team, shaped by your theology. It's what makes this platform sound like Jesus and not like a tech company's chatbot. No one can take it from you because you downloaded the base weights, fine-tuned them yourself, and run them on your own infrastructure.

### How a Single Conversation Flows (Dual-Model)

```
User sends message via WhatsApp in Farsi:
    "I had a dream about a man in white. Who is he?"
    │
    ▼
ORCHESTRATOR — Input Classifier
    → Language: Farsi
    → Emotional state: Awe, seeking
    → Intent: Dream/vision inquiry
    → Cultural context: Likely Muslim background
    → Priority: HIGHEST (dream/vision trigger)
    │
    ▼
ORCHESTRATOR — Conversation State Manager
    → Strategy: DREAM/VISION RESPONSE
    → Treat with reverence. This person may have encountered Jesus.
    → Don't dismiss. Don't over-explain. Honor the experience.
    │
    ▼
ORCHESTRATOR — RAG Engine pulls:
    → Daniel's visions, Paul's Damascus road
    → Scriptural descriptions of Jesus in white
    → Muslim-background believer testimonies involving dreams
    → Cultural context: Iranian Muslim, honor/shame dynamics
    │
    ▼
ORCHESTRATOR calls MODEL A (The Brain):
    → "Given this context [RAG results + conversation history],
       generate the theological content for a response to a
       Farsi-speaking Muslim who had a dream of Jesus. Include
       relevant scripture references. 2-3 key points only."
    → Model A returns: theological content, scripture refs,
       suggested approach
    │
    ▼
ORCHESTRATOR calls MODEL B (Our Voice):
    → "Take this theological content and deliver it in our
       conversational style. This person is in awe. Be warm.
       Be reverent. Ask a question. Mirror Jesus' approach.
       Output in Farsi."
    → Model B transforms the content into our voice
    │
    ▼
ORCHESTRATOR — Output Validator:
    ✅ Treats dream with reverence (not dismissive)
    ✅ Scripturally grounded
    ✅ Culturally appropriate for Iranian Muslim context
    ✅ Asks a question (Jesus' method)
    ✅ Voice quality matches our standard
    │
    ▼
ORCHESTRATOR — Parallel Actions:
    → 🙏 Prayer alert: Highest priority, Muslim-background dream
    → 👤 Human standby: Farsi-speaking former-Muslim believer matched
    → 🔒 Security: Closed-country protocols active, no PII stored
    │
    ▼
Response delivered in Farsi:
    "What you experienced sounds profound and real. Many people
    across the Middle East have described dreams exactly like
    yours — a man in white, radiating peace and authority.
    I believe the one you saw is Isa (Jesus). Can I share
    what the scriptures say about who he is?"
```

### Technical Independence Roadmap

**Our goal: Full ownership of the voice model. No AI company can shut us down.**

| Phase | Timeline | What Happens | Model A (Brain) | Model B (Voice) | Cost |
|-------|----------|-------------|-----------------|-----------------|------|
| 1 | Now - Month 6 | Prove concept, collect data | Claude API | System prompt only (no separate model yet) | $5K-$15K |
| 2 | Month 6-12 | Build our voice | Claude API | Fine-tune small open-source model (7B-13B) on our conversation data | $20K-$50K |
| 3 | Month 12-24 | Full voice ownership | Claude API (or any LLM) | Continue pre-train larger model (70B) on gospel corpus + fine-tune + RLHF | $250K-$500K |
| 4 | Month 24+ | Full independence | Open-source brain (backup) + API for edge cases | Our model, our hardware, our weights | $5K-$20K/month ongoing |

**End state:** Model B runs on our GPU servers. We own the weights. We own the training data. We own the review process. If every AI company on earth shut down tomorrow, our platform keeps running.

### What We Own vs. What We Rent

| Component | Own or Rent | Can It Be Taken Away? |
|-----------|------------|----------------------|
| The Orchestrator (our code) | **OWN** | No — it's our software |
| Model B: The Voice | **OWN** | No — downloaded weights on our hardware |
| The theological framework / system prompt | **OWN** | No — it's our document |
| The knowledge base (scripture, apologetics, etc.) | **OWN** | No — it's our curated data |
| All conversation training data | **OWN** | No — it's our collected data |
| RLHF review scores and process | **OWN** | No — it's our methodology |
| Model A: The Brain (Claude API) | **RENT** | Yes — but it's replaceable. Swap to another API or open-source brain anytime. |
| GPU hosting | **RENT** | Switch providers anytime. Or buy hardware outright ($50-80K). |

### Cost Summary: Path to Full Ownership

| Milestone | Cumulative Investment | Monthly Ongoing |
|-----------|----------------------|-----------------|
| Working prototype | $5,000-$15,000 | $100-250/month |
| Voice model v1 (fine-tuned) | $25,000-$65,000 | $500-3,000/month |
| Voice model v2 (full custom) | $275,000-$565,000 | $5,000-$20,000/month |
| Full independence | $300,000-$600,000 | $5,000-$20,000/month |

### Architecture Terminology Quick Reference

| Term | What It Means | Our Context |
|------|--------------|-------------|
| **Orchestrator** | Our custom code that controls everything | The brain of the platform — decides what to do, calls models as tools |
| **Model A (Brain)** | External LLM for knowledge and reasoning | Claude API now, replaceable anytime |
| **Model B (Voice)** | Our owned model for communication style | Fine-tuned open-source model we control — our pastoral voice |
| **RAG** | Retrieval Augmented Generation | Scripture, apologetics, testimonies — our curated truth |
| **RLHF** | Reinforcement Learning from Human Feedback | Pastors and missionaries rating every response, model improves over time |
| **Fine-tuning** | Training a model on specific data | Teaching Model B our voice using thousands of reviewed conversations |
| **Continued pre-training** | Deep domain training on a base model | Feeding Model B billions of tokens of Bible, theology, missions literature |
| **Open-source weights** | Model files you download and own | Llama, Mistral — free, commercial use, can never be taken away |
| **Guardrails** | Rules preventing off-track responses | Doctrinal validation, output screening, boundary rules |
| **Conversation State** | Tracking journey stage | Curious → seeking → wrestling → deciding → growing |

---

## Technical Stack: What Everything Is Built On

This section defines the exact technologies, libraries, and infrastructure behind every component of the platform. Everything is either free open-source software or commodity cloud services that can be switched between providers at any time. The only proprietary elements are our orchestrator code, our training data, our fine-tuned model weights, and our RLHF methodology.

### The Orchestrator

The orchestrator is a standard software application — custom code we write and own. It controls the entire conversation flow. The AI models are tools it calls, like CNC software calling a motor controller. The models don't decide what happens. The orchestrator does.

| Component | Technology | Why |
|-----------|-----------|-----|
| **Language** | Python | The entire AI/ML ecosystem is built in Python. Every library, tool, and tutorial. When we train our own model, it's all Python. |
| **Web Framework** | FastAPI | Fast, modern, built for APIs. The orchestrator is an API server that receives messages, processes them through our logic, calls models, and returns responses. |
| **Primary Database** | PostgreSQL | Conversation history, user journey state, structured data. Battle-tested, open source. |
| **Vector Database** | Pinecone, Weaviate, or Chroma | Powers the RAG knowledge base. This is how the system searches scripture and apologetics to find the right context for each conversation. |
| **Message Queue** | Redis or RabbitMQ | Handles async tasks: prayer alerts, human handoff triggers, RLHF review pipeline queuing. |
| **Hosting** | Railway / AWS / Google Cloud | Starts at $20-50/month, scales as needed. Switchable anytime. |

### Model B: The Voice (Our Owned Model)

#### The Base Model (What We Download and Own Forever)

We start with an open-source foundation model. Once downloaded, these are files on our hard drive. No one can take them back. No API. No dependency.

| Model | Creator | Strengths | Parameters | License |
|-------|---------|-----------|------------|---------|
| **Llama 3.1** | Meta | Most popular open-source model. Massive community, extensive tooling, well-documented. Best overall bet. | 8B / 70B / 405B | Free commercial use |
| **Mistral Large** | Mistral AI (France) | Strong multilingual capabilities. Good for Arabic, Farsi, Hindi. | Various | Open weights, commercial |
| **Qwen 2.5** | Alibaba | Excellent for Asian languages. | Various | Open weights, commercial |

The model weights are typically 15-150GB depending on model size. They live on our server or hard drive.

#### The Training Stack

| Component | Technology | What It Does |
|-----------|-----------|-------------|
| **Deep learning framework** | **PyTorch** | The foundation that does the actual math of training. Free, open source, built by Meta. Every major AI model in the world is built on PyTorch. |
| **Model toolkit** | **Hugging Face Transformers** | High-level library for loading models, tokenizing text, running inference, fine-tuning. Sits on top of PyTorch. Free, open source. |
| **Fine-tuning tool** | **Axolotl** or **Unsloth** | Axolotl: most popular fine-tuning tool. Write a config file ("here's my model, here's my data, here are my settings") and it handles training. Unsloth: newer, faster, uses less GPU memory. |
| **RLHF training** | **Hugging Face TRL** (Transformer Reinforcement Learning) | The library specifically built for training models on human feedback. When our review team rates conversations, TRL uses those ratings to improve Model B. |
| **Preference optimization** | **DPO** (Direct Preference Optimization) | The specific algorithm for RLHF. Simpler than older methods. Just needs pairs of "good response vs. bad response" and learns to produce more of the good ones. |

#### Training Data Format

Our training data is JSON files. Each entry is an input/output pair:

```json
{
  "input": "I had a dream about a man in white robes. Who was he?",
  "context": "Farsi speaker, likely Muslim background, dream/vision trigger, highest priority",
  "ideal_output": "What you experienced sounds real and profound. Many people across the Middle East have described dreams exactly like yours — a man in white, radiating peace and authority. I believe the one you saw is Isa (Jesus). Can I share what the scriptures say about who he is?",
  "theology_score": 5,
  "tone_score": 5,
  "jesus_method_score": 5,
  "reviewer": "Pastor Ahmad (former Muslim background)"
}
```

We build thousands of these from real conversations reviewed by our team. This is our training dataset. It's our intellectual property.

#### The RLHF Pipeline (How the Voice Improves Over Time)

```
Real conversation happens on platform
        │
        ▼
Conversation enters review queue
        │
        ▼
Review team (pastors, missionaries, theologians) scores it:
    • Theological accuracy (1-5)
    • Tone and warmth (1-5)
    • "Would Jesus say it this way?" (1-5)
    • Notes on what should change
        │
        ▼
Reviewer writes ideal response (if score < 4)
        │
        ▼
Data pairs collected: [AI response] vs [ideal response]
        │
        ▼
Quarterly: DPO training cycle using Hugging Face TRL
    • Model B learns to produce more of what reviewers rate highly
    • Model B learns to avoid what reviewers rate poorly
        │
        ▼
Updated Model B deployed → Voice gets closer to Jesus' voice
        │
        ▼
Cycle repeats. Model improves with every review cycle.
```

The review interface is a simple web app we build (React frontend + Python backend) where reviewers see conversations and submit ratings. Standard software — not AI.

### GPU Compute (The Hardware That Runs Everything)

#### For Training (Periodic — Not Continuous)

| Task | Hardware Needed | Time | Cost per Run |
|------|----------------|------|-------------|
| Fine-tune 7B model | 1-2 A100 GPUs | 4-8 hours | $10-50 |
| Fine-tune 70B model | 4-8 A100 GPUs | 24-72 hours | $500-2,000 |
| Continued pre-training 70B | 8-16 A100 GPUs | Days-weeks | $5,000-20,000 |
| RLHF cycle (quarterly) | 4-8 A100 GPUs | 24-48 hours | $500-2,000 |

Cloud GPU providers: Lambda Labs (~$1-3/hr per GPU), RunPod (~$0.50-2/hr), AWS/Google Cloud (~$1-4/hr)

#### For Serving (Running Live Conversations — Continuous)

| Model Size | Hardware | Monthly Cost (Cloud) | Buy Outright |
|------------|----------|---------------------|-------------|
| 7B model | 1x A100 GPU | $750-1,500/month | ~$15,000-20,000 |
| 70B model | 2-4x A100 GPUs | $3,000-6,000/month | ~$60,000-80,000 |
| 70B quantized (compressed) | 1-2x A100 GPUs | $1,500-3,000/month | ~$30,000-40,000 |

Quantization compresses the model to run on less hardware with minimal quality loss. This is likely the sweet spot for production.

**Full hardware independence option:** Buy a 4x A100 GPU server (~$60-80K), put it in a data center or our factory. No monthly GPU costs after that — just electricity and internet. No one on earth can turn it off except us.

### Complete Stack Summary

| Component | Built With | Cost | Own or Rent |
|-----------|-----------|------|-------------|
| **Orchestrator** | Python + FastAPI | Our time | **OWN** |
| **Database** | PostgreSQL + Redis | $20-100/month | **OWN** (our data) |
| **RAG Knowledge Base** | Vector DB (Pinecone/Chroma) + Embeddings | $20-200/month | **OWN** (our curated content) |
| **Model B base weights** | Llama 3.1 via Hugging Face | Free download | **OWN** forever |
| **Fine-tuning** | PyTorch + Axolotl or Unsloth | $10-2,000 per run | **OWN** the resulting weights |
| **RLHF training** | Hugging Face TRL + DPO | $500-2,000 per cycle | **OWN** the methodology + results |
| **Training data** | JSON files we create | Our time + review team | **OWN** |
| **Review interface** | React + Python web app | Our time | **OWN** |
| **GPU for training** | Lambda Labs / RunPod | $10-2,000 per run | Rent (periodic, not continuous) |
| **GPU for serving** | Lambda / RunPod / own hardware | $750-6,000/month OR $60-80K one-time | Rent or **OWN** |
| **Model A (brain)** | Claude API or any LLM API | ~$0.003-0.015 per 1K tokens | Rent (replaceable) |
| **Web hosting** | Railway / AWS / Google Cloud | $50-500/month | Rent (switchable) |

The entire AI industry is built on this same stack. Anthropic uses PyTorch. OpenAI uses PyTorch. Meta uses PyTorch. We're using the same foundation they are — just for a very specific, very sacred purpose.

---

## Layer 1: Conversational Gospel AI (The Core Engine)

### What It Is

A world-class AI system purpose-built for deeply personal, culturally intelligent, patient, loving conversations about Jesus. Not a tract. Not a sermon. A *conversation* — the way Jesus did it. The woman at the well. Nicodemus. The road to Emmaus. One on one, meeting people exactly where they are.

### Key Capabilities

- Speaks every major world language
- Understands cultural context — a factory worker in Bangladesh gets a different conversation than a tech worker in Berlin or a college student in São Paulo
- Answers hard questions honestly and thoughtfully
- Never gets frustrated, never gives up
- Available 24/7 including 3am when someone is lying awake questioning everything
- Doctrinally sound with clear theological guardrails

### Technical Approach

- **Dual-model architecture:** Model A (Claude API or any LLM) provides knowledge and reasoning. Model B (our fine-tuned open-source model) provides the voice and pastoral delivery. We own Model B.
- **Orchestrator** (Python + FastAPI) controls everything — models are tools it calls, not decision-makers
- Carefully crafted system prompt encoding theology, conversational style, and doctrinal guardrails (written from Jesus' perspective)
- **RAG knowledge base** (vector database) for grounded scripture, apologetics, testimonies, and cultural context
- Conversation memory to maintain continuity across sessions
- Multi-language support via model capabilities + translation layer for edge languages
- **RLHF pipeline** — every conversation reviewed by pastors/missionaries, ratings feed back into Model B training quarterly

### Build Tool

Claude Code — architect and ship the orchestrator, web interface, and conversation engine. Phase 1 uses Claude API as a single model; dual-model architecture activates in Phase 3.

### Status

- [ ] Define theological framework and doctrinal guardrails
- [ ] Design conversational approach (Jesus' model: questions, stories, meeting people where they are)
- [ ] Build core API and system prompts
- [ ] Build web-based conversation interface (prototype)
- [ ] Test across languages and cultural contexts
- [ ] Establish theological review board / advisors

---

## Layer 2: Prayer Engine (The Heartbeat)

### Why This Changes Everything

Prayer isn't a feature — it's the spiritual engine that makes this more than technology. Without prayer, this is a chatbot. With prayer, it's a vessel for the Holy Spirit.

### Three Dimensions of Prayer

**A. The AI Prays With People in the Moment**

When someone shares a burden, the AI doesn't say "I'll pray for you" as a cliché. It writes out a specific, personal prayer right there in the conversation:

> "Lord, Sarah's mother just passed and the grief is crushing. Would you meet Sarah in this darkness. Remind her that You are close to the brokenhearted. Give her the peace that passes understanding tonight. In Jesus' name, amen."

For many people — especially in closed countries with no church — this could be the first time anyone has ever prayed for them personally. That moment can break a heart open.

**B. Teaching People to Pray**

For someone from a Hindu, Muslim, or secular background who just accepted Jesus, they may have zero framework for how to talk to God. The AI walks them through it:

- The Lord's Prayer as a template and what each line means
- Conversational prayer — just talking to God like a Father
- Praying scripture — turning God's words back to Him
- Listening prayer — silence and hearing God's voice
- Prayers for specific situations (fear, grief, gratitude, confession, intercession)
- Cultural contextualization — prayer posture and practice varies by culture

This becomes a core module in the discipleship pipeline.

**C. Global Prayer Network (Humans Behind the Screen)**

This is the piece that transforms the platform spiritually:

- When someone shares a burden with the AI, it gets anonymized and sent to a **real prayer network** — believers around the world interceding for that person
- Prayer teams organized by time zone for 24/7 coverage
- Someone in Bangladesh shares their struggle → a prayer team in Austin, Seoul, or Nairobi is praying within minutes
- A prayer wall where intercessors can see (anonymized) needs from around the globe
- The person in conversation can be told: *"Real believers around the world are praying for you right now."*

The AI is the front door. The body of Christ is behind it praying. That's the kind of infrastructure the Holy Spirit moves through.

### Status

- [ ] Design AI prayer conversation module (praying with people)
- [ ] Build prayer teaching curriculum for new believers
- [ ] Architect global prayer network platform
- [ ] Build anonymized prayer request pipeline
- [ ] Design prayer team onboarding and management
- [ ] Build prayer wall interface
- [ ] Recruit initial prayer team network

---

## Layer 3: Human Connection Layer (People Behind the Platform)

### Why This Is Non-Negotiable

People need to know this isn't just silicon and code. Real believers stand behind every conversation. This isn't just a crisis escalation path — it's a **core feature** of the platform.

### Transparency From the Start

Early in every conversation, the AI communicates:

> *"I'm an AI assistant built to have conversations about faith. But I'm backed by a community of real believers around the world who are praying for every person who comes here. If you ever want to talk to a real person, just say the word."*

This changes the entire dynamic. It builds trust. It shows this is a ministry, not a product.

### When Conversations Transition to Humans

| Trigger | Action |
|---------|--------|
| **Someone makes a decision for Christ** | Real human follows up within 24 hours — celebration, next steps, church connection |
| **Someone asks to talk to a real person** | Instant handoff to trained volunteer or pastor, matched by language and time zone |
| **Conversations go deep over multiple sessions** | Offer a human mentor or pastoral connection |
| **Crisis situations** | Immediate routing to crisis-trained team + local resources |
| **Baptism, church joining, ongoing discipleship** | Always human-guided from this point |
| **Complex theological questions** | AI flags low confidence → connects to a trained apologist or pastor |

### The Human Network

- **Trained volunteer responders** — believers worldwide who can take handoffs via chat, voice, or video
- **Pastoral connections** — local pastors and church leaders in a global directory
- **Specialized teams** — crisis counselors, apologists, former Muslims/Hindus/Buddhists who can relate to specific backgrounds
- **Business chaplains** — workplace-specific pastoral care through chaplaincy partnerships
- **Mentorship matching** — long-term pairing of new believers with mature Christians in their region/language

### Status

- [ ] Design human handoff protocol and conversation transfer system
- [ ] Build volunteer recruitment and training platform
- [ ] Create matching algorithm (language, time zone, cultural background, specialty)
- [ ] Integrate with local church directory for pastoral connections
- [ ] Build crisis response team infrastructure
- [ ] Develop mentor matching and tracking system
- [ ] Partner with business chaplaincy organizations

---

## Layer 4: Voice & Audio Layer (Reach Oral Cultures)

### Why This Is Critical

A huge percentage of the unreached world is **oral culture** — they don't read. In parts of Sub-Saharan Africa, South Asia, and Southeast Asia, literacy rates are low but smartphone penetration is rising fast. If the platform only types, it misses hundreds of millions of people. The platform needs to **talk**.

### Capabilities

**A. Real-Time AI Voice Conversations**

Using AI voice synthesis (ElevenLabs, Fish Audio, or similar), the platform can have spoken conversations — not just text:

- Someone sends a WhatsApp voice note in Somali → the AI understands it and responds with a voice note in Somali
- Phone call mode — dial a number, have a gospel conversation by voice
- The voice sounds warm, human, and culturally appropriate — not robotic
- A farmer in rural Niger who can't read can have a voice conversation about Jesus on his phone in Hausa. This is currently impossible through any existing ministry.

**B. Audio Bibles & Spoken Discipleship**

For oral cultures, the entire discipleship pipeline needs an audio-first mode:

- Full audio Bible in hundreds of languages
- Spoken discipleship lessons — prayer training, Bible study, daily devotionals
- Story-based gospel presentations (oral cultures learn through narrative, not propositional truth)
- Integrate with existing audio Bible resources (Faith Comes By Hearing, etc.)

**C. AI-Generated Audio Content at Scale**

- Automatically produce gospel content as audio in thousands of languages
- Distribution on local radio stations, podcast platforms, and messaging apps
- AI voice cloning to maintain consistent, trusted voices per language/culture
- Worship and prayer content generated in local musical styles

### Status

- [ ] Integrate AI voice synthesis (ElevenLabs API or equivalent)
- [ ] Build WhatsApp voice note conversation flow
- [ ] Develop phone call gospel conversation system
- [ ] Partner with Faith Comes By Hearing and audio Bible organizations
- [ ] Create oral culture discipleship curriculum (story-based, audio-first)
- [ ] Build audio content generation pipeline for mass distribution
- [ ] Test voice quality across priority languages (Hausa, Swahili, Hindi, Arabic, Somali)

---

## Layer 5: Distribution Network (Reach Billions)

### Principle

The AI doesn't live in one place. It lives everywhere people already are. Zero friction to access from anywhere on earth.

### Channels

| Channel | Why It Matters | Priority |
|---------|---------------|----------|
| **WhatsApp / Telegram / SMS bots** | In Africa, South Asia, Latin America — messaging apps ARE the internet. This is the single highest-reach channel for the developing world. | 🔴 Critical |
| **Embeddable widget** | Any church, ministry, or Christian business drops it on their website in minutes. Free forever. 100,000 churches = hundreds of millions reached. | 🔴 Critical |
| **Standalone web app** | Direct access, no download required | 🟡 High |
| **Mobile apps (iOS/Android)** | App store presence worldwide | 🟡 High |
| **Social media integration** | Shareable conversation links. Someone has a powerful exchange, shares the link, their whole network sees it. | 🟡 High |
| **Physical product QR codes** | Furniture, partner products — physical objects become permanent gospel onramps | 🟢 Medium |
| **Partnership API** | Let YouVersion, Jesus Film Project, Cru, and others plug in to enhance what they already do | 🟢 Medium |

### The Math

- WhatsApp has 2.7 billion users
- If the bot goes viral in even a fraction of markets, reach is there
- If 10% of people who engage genuinely accept Jesus → need 10 billion conversations
- WhatsApp processes 100 billion messages/day — the infrastructure exists

### Status

- [ ] Build WhatsApp bot integration (highest priority distribution channel)
- [ ] Build Telegram bot integration
- [ ] Build embeddable website widget + church onboarding flow
- [ ] Build standalone web app
- [ ] Design viral sharing mechanics for conversations
- [ ] Develop partnership outreach strategy for major ministries
- [ ] QR code system integrated with Couch Potatoes products

---

## Layer 6: Video & Visual Content Engine

### Why Video Matters Most

Video is the dominant content medium globally, especially in the 10/40 window where mobile data costs are dropping fast. Ministries using TikTok and YouTube in Central Asia and Afghanistan are seeing millions of views and thousands of discipleship commitments. Your Intelligence Layer should power a content machine that generates video at scale.

### Capabilities

| Capability | Description |
|------------|-------------|
| **Short-form video generation** | AI-generated scripts culturally adapted for TikTok, Instagram Reels, YouTube Shorts — in dozens of languages |
| **Testimony dubbing** | Real testimonies dubbed into local languages using AI voice cloning — maintaining emotional authenticity |
| **Visual gospel content** | AI-generated images, animations, and illustrated Bible stories for cultures where visual storytelling resonates |
| **Video-to-conversation onramp** | Every video ends with a link/QR to start a personal conversation with the AI — converting viewers into seekers |
| **Localized visual style** | Content that looks and feels native to each culture — not Western Christianity exported |

### The Funnel

```
TikTok/YouTube/Reels (billions of impressions)
    → Curiosity sparked
    → Click link to start conversation
    → Conversational Gospel AI engages
    → Discipleship pipeline activated
```

Video is the **top of funnel** that feeds everything else.

### Status

- [ ] Build AI video script generation pipeline (multi-language)
- [ ] Integrate AI voice dubbing for testimony videos
- [ ] Design video-to-conversation onramp flow
- [ ] Create visual content templates adapted for major cultural regions
- [ ] Develop TikTok/YouTube/Reels distribution strategy
- [ ] Partner with existing video ministries (Jesus Film, BibleProject, 3xM)

---

## Layer 7: Discipleship Pipeline (Hearing → Believing → Growing)

### The Problem This Solves

Most evangelism efforts fail at follow-through. Someone has a moment of openness and then... nothing. This system doesn't let that happen.

### Pipeline Stages

```
Curiosity → Understanding → Decision → Next Steps → Discipleship → Community → Multiplication
```

### Components

1. **Guided journey** — The AI walks people from curiosity through understanding to decision to next steps, all in conversation
2. **Local church connection** — Global directory connecting new believers to churches and believers near them
3. **Ongoing discipleship conversations** — Bible study, prayer, questions about living out faith
4. **Micro-community connections** — Link new believers in the same region to each other
5. **Resources in their language** — Scripture, audio Bibles, video content, curated by language and culture
6. **Multiplication training** — Equip new believers to share their faith and start the cycle again

### Gamification & Engagement Mechanics

Duolingo didn't reach 500M users by being educational. It reached them by being engaging. The discipleship pipeline needs similar behavioral design — not to trivialize faith, but to keep people in a journey they'd otherwise abandon after week two.

- **Bible reading streaks and milestones** — daily engagement momentum
- **Journey visualization** — "Here's where you are in your spiritual exploration" progress map
- **Achievement moments** — "You've read through the Gospel of John," "You've prayed every day for 30 days"
- **Community challenges** — prayer chains, scripture memory, sharing milestones
- **Milestone celebrations** — the AI and the human network celebrate key moments together

### Trauma & Recovery Pathways

A disproportionate number of people open to the gospel are in crisis. Jesus said he came for the sick, not the healthy. These aren't edge cases — they may be the **primary use cases**.

| Pathway | Description |
|---------|-------------|
| **Addiction recovery** | Integrate with Celebrate Recovery-style content. AI-guided recovery conversations grounded in scripture. |
| **Abuse survivors** | Domestic violence, trafficking, sexual abuse — trauma-informed gospel care. Immediate safety resources + long-term healing. |
| **Refugees & displaced people** | Specific languages: Ukrainian, Syrian Arabic, Rohingya, Tigrinya. Content addressing loss, identity, and hope. |
| **Post-conflict trauma** | Sub-Saharan Africa, Middle East, Myanmar — gospel as healing for war-torn communities. |
| **Grief & loss** | Already in the conversation flow, but expanded into a full guided journey. |
| **Mental health** | Depression, anxiety, suicidal ideation — gospel hope with appropriate professional referral. |

### Children & Youth Track

The global population skews young — especially in Africa and South Asia where the church is growing fastest. If you're serious about a billion, you can't ignore the next generation.

- **Children's Bible stories** — interactive, visual, audio-first for younger kids
- **Teen/young adult content** — addressing their specific questions: identity, purpose, sexuality, doubt, peer pressure, social media
- **Parenting resources** — for new believing families learning to raise children in faith
- **Age-appropriate AI guardrails** — conversation style, content depth, and topic boundaries automatically adjust for detected age group
- **Youth-specific onramps** — content and channels that meet Gen Z and Gen Alpha where they are (TikTok, Snapchat, gaming platforms)

### Status

- [ ] Design the full conversation journey from curiosity to discipleship
- [ ] Build or integrate global church/ministry directory
- [ ] Develop ongoing discipleship conversation modules
- [ ] Build community connection features
- [ ] Curate and integrate multilingual resources (partner with Bible societies, etc.)
- [ ] Design gamification system (streaks, milestones, journey map)
- [ ] Build trauma & recovery conversation pathways
- [ ] Partner with Celebrate Recovery, trauma-informed care organizations
- [ ] Develop children's interactive content and youth tracks
- [ ] Build age detection and content adaptation system

---

## Layer 8: Digital Missionary Platform (Multiply the Workforce)

### The Concept

The platform shouldn't just reach the lost directly — it should **multiply the workforce**. Think Uber: you built the platform, thousands of drivers operate on it. Your platform equips thousands of believers to become digital missionaries.

### How It Works

- **Onboarding & training** — believers sign up, get trained on how to use the platform as their evangelism tool
- **Personal dashboards** — each digital missionary sees their conversations, follow-ups, prayer requests, impact metrics
- **AI-assisted responses** — the AI drafts responses that the human missionary can edit and personalize before sending (human-AI collaboration)
- **Region/language adoption** — church small groups "adopt" a region or language and monitor conversations, praying specifically
- **Gamified participation** — milestones, community, leaderboards (conversations started, people connected to churches, discipleship journeys begun)
- **Team structure** — organize missionaries into teams by language, region, or specialty

### Why This Scales

- 10,000 digital missionaries × 10 conversations/day = 100,000 daily conversations
- Combined with pure AI conversations, you get the best of both: **AI scale with human heart**
- Every church in your partnership network becomes a source of digital missionaries
- College students, retirees, homebound believers, night-shift workers — anyone with a phone and a heart for the lost

### Status

- [ ] Design digital missionary onboarding and training program
- [ ] Build missionary dashboard (conversations, impact, prayer requests)
- [ ] Develop AI-assisted response system (AI drafts, human edits)
- [ ] Create region/language adoption system for church small groups
- [ ] Build gamification and community features for missionaries
- [ ] Partner with missions organizations for recruitment pipeline

---

## Layer 9: Intelligence Layer (The Great Commission Engine)

### What It Does

The strategic brain of the ecosystem. Sees the big picture, identifies gaps, generates content at scale, and coordinates with the global church.

### Capabilities

| Capability | Description |
|------------|-------------|
| **Real-time analytics** | Where is the gospel spreading fastest? Where are the gaps? |
| **Unreached people group identification** | Cross-reference conversation data with missions databases to find blind spots |
| **Auto-content generation** | Produce gospel content in thousands of formats and languages — social media, podcasts, video scripts, print |
| **Missionary coordination** | Feed intelligence to organizations on where people are responsive |
| **Cultural contextualization engine** | Auto-generate culturally appropriate gospel presentations for specific people groups |
| **Impact dashboard** | Track the ripple effect — conversations → decisions → discipleship → multiplication |
| **Church planting intelligence** | Detect clusters of new believers in areas with no church → alert church planting organizations → provide gathering resources |

### Church Planting Intelligence (New)

Go beyond connecting people to existing churches — use data to **plant new ones**:

- When the platform detects a geographic cluster of new believers with no local church, it flags the area
- Alerts church planting organizations (e.g., Acts 29, SEND, Frontiers) with anonymized data
- Provides resources for new believers to start gathering (house church guides, worship resources, discipleship curriculum)
- Essentially automates the identification of where new churches should be planted based on real conversion data
- Over time, this becomes the most valuable missions intelligence dataset in the world

### The Living Map

A real-time visualization showing gospel impact spreading across the globe. Every conversation, every decision, every new believer — visible on a dashboard that shows the progress toward 1 billion.

### Status

- [ ] Design analytics architecture
- [ ] Build impact tracking and dashboard
- [ ] Integrate unreached people group databases (Joshua Project, etc.)
- [ ] Build content generation pipeline
- [ ] Develop missionary organization partnership & data sharing model

---

## Layer 10: Strategic Partnerships (Force Multipliers)

### The Insight

You don't need to build the audience. The audience already exists across dozens of platforms and ministries. You need to become the **conversational layer** they're all missing.

### Tier 1: Distribution Partnerships (Massive Reach)

| Partner | Why They Need This | Potential Impact |
|---------|-------------------|-----------------|
| **YouVersion** | 600M+ installs. People read the Bible but have questions. No conversational layer exists. | Your AI becomes the "talk to someone" button inside the world's most-used Bible app |
| **He Gets Us** | Spending $100M+ on ads driving people to a website. What happens after the click? | Your platform becomes the conversion engine behind the most expensive evangelism campaign in history |
| **The Chosen** | Millions emotionally engaged with Jesus' story. They want to go deeper. | Your AI is the next step when someone finishes an episode and wants to explore faith |
| **Hallow** | Catholic prayer/meditation app with millions of users. Crossover potential. | Ecumenical bridge — your AI handles the gospel conversation for a prayer-focused audience |
| **Alpha Course** | Already structured for evangelism. Moving online. | Your AI extends Alpha's reach between sessions and to people who won't attend in person |

### Tier 2: Ministry & Missions Partnerships (Strategic Depth)

| Partner | Integration |
|---------|------------|
| **Cru / Campus Crusade** | Campus evangelism tool. Students scan a QR code, have a conversation. |
| **Jesus Film Project** | After watching the film, viewers engage the AI for questions and next steps |
| **Wycliffe / Bible translators** | Scripture in rare languages feeds directly into the RAG knowledge base |
| **Joshua Project** | Unreached people group data feeds the Intelligence Layer |
| **Business Chaplaincy orgs** | Workplace gospel access through existing chaplaincy programs |
| **Local church networks** | The handoff destination for every new believer. The most important partnership of all. |

### Tier 3: Technology Partnerships

| Partner | Value |
|---------|-------|
| **Anthropic** | AI engine provider. Potential mission-aligned pricing or partnership. |
| **WhatsApp / Meta** | Business API access for global messaging distribution |
| **Signal Foundation** | Encrypted messaging for closed countries where privacy is life-or-death |

### Partnership Approach

The pitch to every partner is the same: **"We built the conversational gospel engine. You have the audience. Together we can reach a billion people."** The platform is free to integrate. The API is open. We make it easy.

### Status

- [ ] Build partnership pitch deck and demo
- [ ] Identify key contacts at YouVersion, He Gets Us, The Chosen
- [ ] Develop API documentation for ministry integration
- [ ] Create case study / proof of concept for partner conversations
- [ ] Approach business chaplaincy networks
- [ ] Engage local church networks (start in Austin, expand)

---

## Layer 11: Closed Countries & Unreached Peoples (The Frontier)

### Why This Is the Most Important Layer

A missionary can't get into North Korea, most of rural China, or large parts of the Middle East and Central Asia. A church building in Iran can be raided. A pastor in Afghanistan can be killed. But **WhatsApp and Telegram already operate in these places.** A person in Tehran, Riyadh, Ürümqi, or Pyongyang can have a private, encrypted gospel conversation on their phone at 2am and no one knows.

No visa required. No foreign missionary to expel. No church building to raid. No risk to the seeker.

**This is the single thing this platform can do that no other evangelism effort in history has been able to do.**

### Unique Capabilities for Closed Contexts

| Capability | Why It Matters |
|------------|---------------|
| **Encrypted messaging** | Conversations on WhatsApp/Signal are end-to-end encrypted. Governments can't read them. |
| **Native language fluency** | AI speaks Farsi, Uyghur, Arabic, Mandarin, Dari, Pashto, Urdu — and understands the cultural weight of each word |
| **Cultural contextualization** | Understands what it means to come to faith where it could cost you your family, your freedom, or your life |
| **Secret believer guidance** | Can guide someone through following Jesus in secret — how to pray, how to read scripture safely, how to find other believers |
| **No digital footprint risk** | Designed to minimize traceability. No app to download that shows on a phone's home screen. Just a chat. |
| **Persecution-aware discipleship** | Discipleship content specifically designed for believers in hostile contexts |
| **Underground church connection** | Carefully, securely connecting new believers to existing underground networks where they exist |

### Priority Regions

| Region | Key Languages | Estimated Unreached |
|--------|--------------|-------------------|
| Middle East & North Africa | Arabic, Farsi, Turkish, Kurdish | 300M+ |
| South Asia | Hindi, Urdu, Bengali, Punjabi | 500M+ |
| Central Asia | Uzbek, Kazakh, Tajik, Turkmen | 50M+ |
| East Asia | Mandarin, Uyghur, Tibetan | 400M+ |
| Horn of Africa | Somali, Amharic, Oromo | 80M+ |
| Southeast Asia | Malay, Indonesian, Burmese | 200M+ |

### Security Considerations

- All conversation data encrypted at rest and in transit
- No personally identifiable information stored unless user opts in
- Server infrastructure in privacy-respecting jurisdictions
- Regular security audits focused on protecting users in hostile environments
- Option for conversation auto-deletion
- No requirement for real name, email, or phone number to engage

### Anti-Persecution Intelligence

Go beyond encryption — actively protect users:

- **Surveillance detection** — AI that detects if conversation patterns suggest a user may be under coercion or someone else is reading their messages
- **Cover mode** — if activated, the conversation interface instantly switches to look like something innocuous (a recipe app, a language learning chat, a shopping conversation)
- **Safe verification protocols** — before connecting believers to each other, verify identity through challenge questions that only a genuine seeker would answer correctly
- **Legal resources** — country-specific persecution response information, rights information, embassy contacts
- **Real-time risk data** — integration with Open Doors World Watch List and persecution incident databases for dynamic risk assessment

### Dream & Vision Response Module

Missions research consistently documents that a significant percentage of Muslim-background believers report dreams and visions of Jesus as part of their conversion journey — a man in white, a figure of light, a voice calling them. This is a documented phenomenon across the Muslim world.

The AI must be ready for someone who messages at 3am saying *"I had a dream about a man in white who told me to find him."*

- Recognize dream/vision language patterns and respond with gravity and scriptural grounding
- Connect the experience to scripture (Daniel, Acts, Paul's Damascus road)
- Guide the person toward understanding who Jesus is
- Offer to pray with them immediately
- Connect them to resources and human follow-up specifically trained for dream/vision responders
- Treat these moments as the highest-priority conversations in the system

### Status

- [ ] Research security requirements for high-risk users in closed countries
- [ ] Engage with persecution ministries (Open Doors, Voice of the Martyrs, ICC) for guidance
- [ ] Develop persecution-aware discipleship conversation modules
- [ ] Build secret believer guidance pathways
- [ ] Design secure connection protocols for underground church networks
- [ ] Prioritize Farsi, Arabic, Mandarin, Urdu for early closed-country deployment
- [ ] Consult with former missionaries to closed countries for conversation design input
- [ ] Build anti-persecution intelligence features (cover mode, surveillance detection)
- [ ] Develop dream/vision response conversation module
- [ ] Partner with ministries experienced in Muslim-background believer care

---

## Layer 12: Offline & Low-Connectivity Mode (Last-Mile Access)

### Why This Matters

Many unreached areas have intermittent or no internet connectivity. Approximately 1 billion+ feature phones (not smartphones) are still in use globally. If the platform requires a stable internet connection and a modern smartphone, it will never reach the last mile.

### Capabilities

| Capability | Description |
|------------|-------------|
| **Offline content downloads** | Core scripture, discipleship modules, prayer guides downloadable for offline use |
| **Conversation queuing** | Users compose messages offline → messages sync and AI responds when connectivity returns |
| **SMS-only mode** | Full gospel conversation capability via basic SMS on feature phones. No smartphone or internet required. |
| **Lightweight app** | Designed for low-end Android phones with minimal storage (under 20MB) |
| **USSD integration** | Menu-based gospel content accessible through USSD codes on any phone (common in Africa) |
| **Local mesh networking** | In areas with multiple users, content can be shared device-to-device without internet |
| **Audio-first offline** | Downloaded audio Bible and discipleship content for oral cultures without connectivity |

### The Last Billion

The people hardest to reach are often those with the least connectivity. This layer ensures that the very last person — the one with a feature phone and no Wi-Fi — can still encounter Jesus.

### Status

- [ ] Design SMS-based gospel conversation system
- [ ] Build offline content download and sync architecture
- [ ] Develop lightweight Android app (sub-20MB)
- [ ] Research USSD integration for African markets
- [ ] Build conversation queuing for intermittent connectivity
- [ ] Partner with organizations experienced in offline-first ministry technology

---

## Layer 13: Funding Engine (Business as Tent-Making)

### Model

This is not a nonprofit begging for donations. It's a self-sustaining economic engine funded by business.

### Revenue Sources

| Source | Description |
|--------|-------------|
| **Couch Potatoes** | Percentage of revenue dedicated to funding the ecosystem |
| **Christian Business Network** | Other businesses join and contribute — their products also become gospel distribution points |
| **Freemium platform tools** | Churches and ministries get the core free; premium analytics, customization, and integration tools generate revenue |
| **Impact investors** | Investors who want to fund scalable evangelism with measurable outcomes |

### Key Principle

The gospel AI and core distribution are **free forever**. No one should ever have to pay to hear the gospel. Premium tools for organizations fund the free tier.

### Status

- [ ] Define Couch Potatoes funding commitment
- [ ] Design freemium model for church/ministry tools
- [ ] Develop Christian Business Network partnership model
- [ ] Create impact investor pitch and materials

---

## Phased Build Plan (Ownership-Focused)

**Guiding principle:** Live from day one. Reaching people while building toward full model ownership. Every phase produces real gospel conversations AND moves toward technical independence.

### Phase 1: Prove the Core (Month 1-2)
**Deliverable:** Working gospel AI prototype using Claude API + system prompt
**Model status:** Claude API only (rented brain, no owned voice yet)

- Refine the system prompt (written from Jesus' perspective)
- Build the orchestrator (conversation state, RAG, guardrails)
- Deploy as a simple, beautiful web app
- Test with 10-20 real people across backgrounds
- **Begin collecting every conversation** — this is your future training data
- Establish RLHF review team (2-3 pastors/missionaries rating responses)
- Cost: ~$2,000-$5,000

### Phase 2: Data Collection & Messaging (Month 3-6)
**Deliverable:** WhatsApp + Telegram live, hundreds of real conversations collected and reviewed
**Model status:** Claude API + system prompt, RLHF review process running

- Build WhatsApp and Telegram bot integrations
- Build prayer conversation module
- SMS fallback for feature phones
- Scale testing to hundreds of users
- **RLHF team reviews EVERY conversation** — theology score, tone score, "would Jesus say this?" score
- Build embeddable website widget
- Begin partnership outreach (YouVersion, He Gets Us, The Chosen)
- Cost: ~$5,000-$15,000 cumulative

### Phase 3: Build Our Voice — Model B v1 (Month 6-12)
**Deliverable:** First version of our owned voice model running in production
**Model status:** Claude API (brain) + fine-tuned 7B-13B open-source model (our voice)**

- Download open-source base model (Llama 3.1 or Mistral) — **ours forever once downloaded**
- Fine-tune on thousands of reviewed conversation pairs from Phase 1-2
- Deploy Model B on our own GPU infrastructure
- Orchestrator now calls both models: brain for knowledge, voice for delivery
- Continue RLHF — model improves with every reviewed conversation
- Build human handoff and prayer network systems
- Launch QR code program through Couch Potatoes
- Cost: ~$25,000-$65,000 cumulative (including GPU training + hosting)

### Phase 4: Deepen the Voice — Model B v2 (Month 12-18)
**Deliverable:** Deeply trained voice model, thousands of conversations per day
**Model status:** Claude API (brain) + continued pre-trained 70B model (our voice)

- Continue pre-training larger model (70B) on gospel corpus: Bible in every available language, theology, apologetics, missionary literature, pastoral counseling, cultural context
- Fine-tune on our growing library of reviewed conversations (now thousands)
- Apply full RLHF training cycle
- Build voice & audio layer (AI voice synthesis for oral cultures)
- Build video & content generation engine
- Launch digital missionary platform
- Deploy discipleship pipeline with gamification
- Cost: ~$275,000-$565,000 cumulative

### Phase 5: Full Independence (Month 18-24)
**Deliverable:** Our model handles the majority of conversations independently
**Model status:** Our 70B voice model as primary + external API only for edge cases (rare languages, complex novel questions)

- Model B now handles most conversations without needing Model A
- External LLM API used only as fallback for unusual situations
- Build closed countries features (anti-persecution intelligence, cover mode, dream/vision module)
- Build offline mode (SMS-only, USSD, lightweight app)
- Launch church planting intelligence
- The Living Map goes live
- Cost: ~$300,000-$600,000 cumulative

### Phase 6: Scale to Billions (Month 24+)
**Deliverable:** Full ecosystem operational, scaling toward 1 billion
**Model status:** Fully owned voice model on our infrastructure + optional API for supplementary tasks

- Our model runs on our GPU servers — we own everything
- Ongoing RLHF retraining quarterly — model keeps improving
- Full partnership network active
- All 13 layers operational
- Scale infrastructure for millions of simultaneous conversations
- Monthly ongoing: $5,000-$20,000/month (scales with usage)

### Investment Summary

| Milestone | When | Cumulative Cost | What You Own |
|-----------|------|----------------|-------------|
| Working prototype | Month 2 | $5K | Orchestrator code, system prompt, initial conversations |
| Voice model v1 | Month 9 | $50K | Fine-tuned 7B model on your GPU, 1000s of reviewed conversations |
| Voice model v2 | Month 18 | $500K | Pre-trained 70B gospel model, full RLHF pipeline, massive training dataset |
| Full independence | Month 24 | $600K | Everything. Model weights, orchestrator, training data, review methodology. No dependency on anyone. |

---

## Comparable Scale References

| Initiative | Reach | Lesson |
|-----------|-------|--------|
| Jesus Film Project | 3+ billion viewers, 2,000+ languages | Proven demand for gospel content at scale; we're building something more personal and interactive |
| YouVersion Bible App | 600+ million installs | Digital faith content has massive global appetite |
| WhatsApp | 2.7 billion users | The distribution infrastructure already exists |
| Duolingo | 500+ million users | AI-powered, conversational, gamified learning scales globally — same model applies to gospel |

---

## Theological Review Platform — Collaborative System Prompt Governance

### Why This Exists

The system prompt is the single most important document in this project. It determines how every conversation about God, Jesus, salvation, suffering, hell, sexuality, other religions, and eternity is handled. If it's wrong, we're putting bad theology in front of people at the most vulnerable moments of their lives. It has to be reviewed, challenged, refined, and improved by the best pastoral and theological minds we can find — across denominations, cultures, and ministry contexts.

This is not a one-time review. The system prompt is a **living document** that gets better over time through structured, transparent collaboration.

### How It Works

**1. Invite-Only Review Access**

Pastors, theologians, missionaries, and trusted ministry leaders are invited via email (magic link — no passwords, no friction). Each reviewer has a profile: name, role, denomination/tradition, region, and ministry context. This is not public. Only invited reviewers and the project owner can see the document and suggestions.

Future option: make the changelog public so the broader church can see how theological decisions evolved — but the review process itself stays invite-only.

**2. The Document — Versioned and Readable**

The current system prompt is displayed as a clean, readable document (not raw code). Every published version is permanently stored. Reviewers always see the latest version but can browse the full history.

**3. Inline Redline Suggestions**

Reviewers can:
- Highlight any section of text
- Suggest specific wording changes (like Google Docs "suggesting" mode / track changes)
- Add a comment explaining **why** they suggest the change — this is required, not optional
- Tag their suggestion by category:
  - **Theological Accuracy** — Is this doctrinally sound?
  - **Scriptural Support** — Does scripture back this? Is the reference correct?
  - **Pastoral Sensitivity** — Would this hurt someone in crisis?
  - **Cultural Sensitivity** — Does this land wrong in specific cultural contexts?
  - **Missing Content** — A topic or scenario not currently addressed
  - **Edge Case Handling** — A conversation path that could go wrong
  - **Tone** — The language is right but the feeling is wrong
- Mark priority: **Critical** / **Important** / **Suggestion**

**4. Discussion Threads**

Other reviewers can reply to any suggestion. Threaded discussions allow real dialogue — not just isolated comments. Reviewers can vote agree/disagree on suggestions to surface consensus. A suggestion with 8 agrees and 0 disagrees is very different from one with 4 agrees and 5 disagrees.

**5. AI-Assisted Compilation**

When it's time to publish a new version, AI assists the process:
- Reviews ALL pending suggestions across the document
- Groups them by section and theme
- Identifies conflicts (where reviewers disagree with each other)
- Proposes a draft incorporating accepted changes with clean language
- Flags items that need human decision — especially theological disagreements where good-faith Christians land differently
- The project owner (Dan) makes final approval on every change

The AI does not make theological decisions. It organizes, synthesizes, and drafts — humans decide.

**6. Release Notes / Changelog**

Every published version includes:
- **Version number** (v1.0, v1.1, v2.0, etc.)
- **Date published**
- **Summary of changes** in plain language (not diffs — readable by anyone)
- **Detailed diff view** for those who want to see exactly what changed
- **Rationale for each change** — why this was updated
- **Contributors** — which reviewers suggested changes incorporated in this version
- **Deferred items** — suggestions that were considered but not included (with explanation)

All reviewers can see the full version history and all release notes.

**7. Transparency Roadmap**
- **Phase 1 (now):** Invite-only. Reviewers and owner only.
- **Phase 2 (future):** Changelog made public — anyone can see how the prompt evolved and why.
- **Phase 3 (future):** Public suggestion submissions — moderated, reviewed by existing reviewers before entering the pipeline.

### User Experience Requirements

This tool is for pastors and missionaries, not developers. The bar is:
- **As simple as reading a document and leaving a comment.** Nothing more complex.
- **Mobile-friendly.** Missionaries in the field may only have a phone.
- **No account friction.** Magic link login via email. No passwords to manage.
- **Works on slow connections.** Lightweight. No heavy JS frameworks if possible.
- **Clear visual hierarchy.** The document is the focus. Suggestions appear as subtle highlights — click to expand. Not cluttered.

### Technical Approach

- Standalone web app (could later integrate into admin dashboard)
- Rich text rendering of the system prompt (markdown → clean display)
- Inline suggestion/comment system (similar to Google Docs suggesting mode)
- PostgreSQL for versions, suggestions, users, votes, comments
- Anthropic API for the compilation/analysis step
- Email-based magic link authentication
- Markdown diff library for version comparison

### Data Model

```
versions
  id, version_number, content (full prompt text), published_at, release_notes, published_by

suggestions
  id, version_id, user_id, selected_text, suggested_text, comment, category, priority,
  status (pending / accepted / rejected / deferred), created_at, resolved_at, resolved_by

comments
  id, suggestion_id, user_id, body, created_at

votes
  id, suggestion_id, user_id, vote (agree / disagree), created_at

users
  id, name, email, role (owner / reviewer), denomination, region, ministry_context,
  invite_code, created_at, last_active
```

### Priority

**HIGH.** This should be built before or alongside the main platform launch. The quality of the system prompt directly determines the quality of every gospel conversation that happens on this platform. Getting 10-20 pastors and theologians from different traditions, cultures, and ministry contexts reviewing it early catches things no single person — no matter how well-intentioned — would catch alone.

### Status

- [ ] Build review platform
- [ ] Invite first 10 reviewers (diverse denominations, cultures, regions)
- [ ] System prompt v1 published for review
- [ ] First round of suggestions collected
- [ ] v1.1 published with changelog
- [ ] Iterate

---

## Open Questions & Decisions Needed

1. **Theological framework** — Which doctrinal statement / tradition grounds the AI? (Non-denominational evangelical core?) → *Partially addressed by Theological Review Platform — reviewers will help define boundaries*
2. **Governance** — Who provides theological oversight? Advisory board composition? → *Addressed by Theological Review Platform — structured reviewer roles with diverse representation*
3. **Entity structure** — Nonprofit, for-profit social enterprise, hybrid?
4. ~~**Name and brand**~~ — ✅ **Seek & Find** (Matthew 7:7)
5. ~~**First language priorities**~~ — ✅ 16 languages implemented: English, Spanish, Portuguese, French, Arabic, Hindi, Mandarin, Indonesian, Farsi, Tajik, Turkish, Swahili, Russian, Urdu, Bengali, Korean, Japanese
6. **Ministry partnerships** — Who to approach first? (YouVersion, He Gets Us, The Chosen, Alpha?)
7. **Measurement** — How do we authentically measure "accepted the gospel" vs. just had a conversation?
8. **Prayer network structure** — How to recruit, train, and manage a global prayer team? Which org model?
9. **Human volunteer pipeline** — How to recruit, vet, train, and manage thousands of conversation responders worldwide?
10. **Ecumenical scope** — Catholic partnerships (Hallow)? Orthodox? Or evangelical-only?
11. **Security posture** — What level of security is needed for closed-country users? Who advises?
12. **Persecution ministry partnerships** — Open Doors, VOM, ICC — how to engage for guidance without compromising users?

---

## Guiding Scriptures

> *"Go therefore and make disciples of all nations..."* — Matthew 28:19

> *"How then will they call on him in whom they have not believed? And how are they to believe in him of whom they have never heard?"* — Romans 10:14

> *"I planted, Apollos watered, but God gave the growth."* — 1 Corinthians 3:6

---

## Next Action

**Build Phase 1.** Get the conversational gospel AI working. Everything else flows from a core engine that actually moves hearts.

Open Claude Code. Start building.
