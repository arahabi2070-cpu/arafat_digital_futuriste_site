import {
  obtenirProduitsBoutique,
  URL_BOUTIQUE_PUBLIQUE,
} from '@/lib/catalogue-boutique'
import { ShopContent } from './shop-content'

/**
 * Section « Boutique » de la page d'accueil — composant SERVEUR
 * (étape 3b du plan console) : il lit le catalogue public de la
 * boutique (produits actifs, prix, visuels) et le passe au
 * composant client ShopContent, qui rend les textes FR/EN.
 *
 * Le paiement et la livraison restent ceux, prouvés, de la
 * boutique : chaque carte renvoie vers la fiche du produit dans
 * la boutique, en nouvel onglet. L'offre du livre imprimé,
 * propre au site, est rendue par ShopContent, séparément.
 *
 * Repli : si le flux est injoignable ou vide, `produits` est
 * vide et ShopContent affiche l'état « liens » de l'étape 3a —
 * la section n'est jamais cassée.
 */
export async function ShopSection() {
  const produits = await obtenirProduitsBoutique()
  return <ShopContent produits={produits} boutiqueUrl={URL_BOUTIQUE_PUBLIQUE} />
}
