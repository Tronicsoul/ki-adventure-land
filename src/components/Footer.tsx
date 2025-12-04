import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Footer = () => {
  const links = [
    { label: "Über uns", href: "#" },
    { label: "Features", href: "#" },
    { label: "Preise", href: "#" },
    { label: "Kontakt", href: "#" },
    { label: "Datenschutz", href: "#" },
    { label: "Impressum", href: "#" },
  ];

  return (
    <footer className="bg-chocolate text-chocolate-foreground py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h3 className="font-display font-bold text-2xl mb-2">
              🦖 DinoGuard
            </h3>
            <p className="text-sm opacity-80">
              Spielerisch sicher im digitalen Dschungel
            </p>
          </motion.div>

          {/* Links */}
          <motion.nav
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm opacity-80 hover:opacity-100 transition-opacity"
              >
                {link.label}
              </a>
            ))}
          </motion.nav>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="border-t border-chocolate-foreground/20 mt-8 pt-8 text-center"
        >
          <p className="text-sm opacity-70 flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-pastel-pink fill-pastel-pink" /> by DinoGuard Team
          </p>
          <p className="text-xs opacity-50 mt-2">
            © 2024 DinoGuard. Alle Rechte vorbehalten.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
