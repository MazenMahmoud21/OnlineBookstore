'use client';

import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  Users, 
  TruckIcon, 
  Shield, 
  Heart, 
  Globe, 
  Award,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: 'شغف المعرفة',
      description: 'نؤمن بأن القراءة هي مفتاح التطور والنمو الشخصي'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'الجودة والأمان',
      description: 'نضمن أعلى معايير الجودة في جميع منتجاتنا وخدماتنا'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: 'خدمة العملاء',
      description: 'رضاكم هو أولويتنا الأولى في كل خطوة'
    },
    {
      icon: <Globe className="h-8 w-8 text-secondary" />,
      title: 'التنوع الثقافي',
      description: 'نقدم مكتبة متنوعة تناسب جميع الأذواق والاهتمامات'
    }
  ];

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'أكثر من 10,000 كتاب',
      description: 'مجموعة ضخمة ومتنوعة من الكتب العربية والعالمية'
    },
    {
      icon: <TruckIcon className="h-6 w-6" />,
      title: 'توصيل سريع',
      description: 'توصيل مجاني لجميع مناطق المملكة خلال 2-3 أيام'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'دفع آمن',
      description: 'أنظمة دفع إلكتروني آمنة ومتعددة'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'جودة مضمونة',
      description: 'كل كتاب يمر بفحص دقيق قبل الشحن'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'كتاب متوفر' },
    { number: '5,000+', label: 'عميل راضٍ' },
    { number: '50+', label: 'ناشر معتمد' },
    { number: '20+', label: 'فئة مختلفة' }
  ];

  const team = [
    {
      name: 'أحمد المالكي',
      role: 'المؤسس والمدير التنفيذي',
      description: 'خبرة 15 عاماً في صناعة النشر والتوزيع'
    },
    {
      name: 'فاطمة الأحمدي',
      role: 'مديرة المحتوى',
      description: 'متخصصة في الأدب العربي والعالمي'
    },
    {
      name: 'خالد العتيبي',
      role: 'مدير التقنية',
      description: 'خبير في تطوير منصات التجارة الإلكترونية'
    }
  ];

  return (
    <div className="min-h-screen pattern-bg">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full mb-6">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-primary font-semibold">من نحن</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 saudi-gradient-text">
              مكتبة المملكة الرقمية
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              رحلتنا بدأت من حب القراءة وإيماننا بقوة الكلمة المكتوبة. نسعى لنكون الوجهة الأولى
              للقراء في المملكة العربية السعودية، نقدم تجربة فريدة تجمع بين التراث والحداثة
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="container mx-auto px-4 py-12">
          <Card className="saudi-gradient-soft border-2 border-primary/20 overflow-hidden animate-scale-in">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full saudi-gradient">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold">رسالتنا</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                نسعى لنشر ثقافة القراءة والمعرفة في المملكة العربية السعودية من خلال توفير
                منصة إلكترونية متطورة تجمع أفضل الكتب العربية والعالمية. نؤمن بأن الكتاب هو
                جسر بين الماضي والحاضر، وبوابة نحو مستقبل مشرق مليء بالمعرفة والإبداع.
              </p>
              <div className="flex items-center gap-3 text-primary">
                <Zap className="h-6 w-6" />
                <span className="font-semibold text-lg">
                  &quot;المعرفة نور، والقراءة طريق النور&quot;
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card 
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="text-4xl font-bold saudi-gradient-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 saudi-gradient-text">قيمنا</h2>
            <p className="text-xl text-muted-foreground">
              المبادئ التي نسير عليها في خدمتكم
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card 
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 hover-lift border-2 hover:border-primary/50 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 saudi-gradient-text">ما يميزنا</h2>
            <p className="text-xl text-muted-foreground">
              نقدم لكم أفضل تجربة شراء للكتب في المملكة
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="hover:shadow-xl transition-all duration-300 hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg saudi-gradient">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-4 py-12 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 saudi-gradient-text">فريق العمل</h2>
            <p className="text-xl text-muted-foreground">
              الأشخاص الذين يعملون لخدمتكم
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card 
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 hover-lift border-2 hover:border-primary/50 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="h-24 w-24 rounded-full saudi-gradient mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-primary font-semibold mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="saudi-gradient text-white border-0 overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 pattern-bg"></div>
              </div>
              <div className="relative z-10">
                <BookOpen className="h-16 w-16 mx-auto mb-6" />
                <h2 className="text-4xl font-bold mb-4">ابدأ رحلتك مع القراءة اليوم</h2>
                <p className="text-xl mb-8 opacity-90">
                  اكتشف عالماً من المعرفة والإبداع في مكتبتنا الرقمية
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <BookOpen className="h-5 w-5" />
                    تصفح المكتبة
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white border-2 border-white/30 px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all"
                  >
                    <Users className="h-5 w-5" />
                    انضم إلينا
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
